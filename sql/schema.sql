-- ProVox Student Portal schema
-- Run once against the Vercel/Neon Postgres database.

create table if not exists settings (
  id integer primary key default 1,
  master_password_hash text not null default '',
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  constraint settings_singleton check (id = 1)
);

insert into settings (id) values (1) on conflict (id) do nothing;

create table if not exists students (
  id text primary key,
  name text not null,
  code text not null unique,
  password_hash text not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  added_date date not null default current_date,
  coach_notes text not null default ''
);

alter table students add column if not exists coach_notes text not null default '';

-- Id of a file in public/avatars (no extension). Empty means "not chosen
-- yet", which renders as a neutral placeholder.
alter table students add column if not exists avatar text not null default '';

-- One row per month-long block of classes. "active" is the block a student is
-- currently in; a student has at most one active contract at a time. Past
-- blocks are kept as "completed" for history.
create table if not exists contracts (
  id text primary key,
  student_id text not null references students(id) on delete cascade,
  contract_number integer not null,
  name text not null,
  weekly_classes integer not null check (weekly_classes > 0),
  monthly_fee text not null default '',
  status text not null default 'active' check (status in ('active', 'completed')),
  payment_received boolean not null default false,
  start_date date not null,
  completed_date date,
  created_at timestamptz not null default now(),
  unique (student_id, contract_number)
);

-- The recurring weekly pattern (e.g. Tue 4pm / Thu 4pm / Sat 6pm) used to
-- generate contract_sessions. Replaced wholesale whenever the coach edits
-- the schedule.
create table if not exists contract_schedule_slots (
  id text primary key,
  contract_id text not null references contracts(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  time_of_day text not null,
  sort_order integer not null
);

-- The actual generated (or manually edited) class dates for a contract.
-- reschedule_source_id points back at the session this one was created to
-- make up for (see status = 'rescheduled' below); cascades so deleting a
-- session also removes any makeup chain hanging off it.
create table if not exists contract_sessions (
  id text primary key,
  contract_id text not null references contracts(id) on delete cascade,
  session_date date not null,
  time_of_day text not null,
  sort_order integer not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'rescheduled')),
  reschedule_source_id text references contract_sessions(id) on delete cascade
);

alter table contract_sessions add column if not exists status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'rescheduled'));
alter table contract_sessions add column if not exists reschedule_source_id text references contract_sessions(id) on delete cascade;

-- How long one class runs, and the fee as a number the dashboard can do
-- arithmetic on. monthly_fee stays as the display string; monthly_fee_amount
-- is the source of truth for every income figure.
alter table contracts add column if not exists class_duration_minutes integer not null default 60;
alter table contracts add column if not exists monthly_fee_amount numeric(14,2) not null default 0;

-- Backfills the numeric fee out of the free-text one written before that
-- column existed ("6,000,000vnđ" -> 6000000). Scoped to rows still sitting at
-- the default so it never clobbers a figure the coach has since corrected.
update contracts
   set monthly_fee_amount = coalesce(nullif(regexp_replace(monthly_fee, '[^0-9]', '', 'g'), '')::numeric, 0)
 where monthly_fee_amount = 0;

create index if not exists idx_contracts_student on contracts(student_id);
create index if not exists idx_contract_schedule_slots_contract on contract_schedule_slots(contract_id);
create index if not exists idx_contract_sessions_contract on contract_sessions(contract_id);
create index if not exists idx_contract_sessions_status on contract_sessions(status);

create table if not exists assignments (
  id text primary key,
  student_id text not null references students(id) on delete cascade,
  title text not null,
  type text not null check (type in ('Homework', 'Material', 'Resource')),
  description text not null default '',
  url text not null default '',
  file_url text,
  file_name text,
  due_date date,
  date_assigned date not null default current_date,
  status text not null default 'assigned' check (status in ('assigned', 'completed')),
  completed_date date
);

create table if not exists submissions (
  id text primary key,
  student_id text not null references students(id) on delete cascade,
  title text not null,
  body_text text not null default '',
  file_url text,
  file_name text,
  date_submitted timestamptz not null default now(),
  status text not null default 'submitted' check (status in ('submitted', 'reviewed')),
  coach_feedback text
);

create index if not exists idx_assignments_student on assignments(student_id);
create index if not exists idx_submissions_student on submissions(student_id);

-- Flashcards -----------------------------------------------------------------

-- A deck belongs to a student, or -- when student_id is null -- to the coach's
-- own library. Library decks are pushed to a student by *copying* them, so the
-- student always owns (and can edit) what they study, and the coach later
-- editing a template never rewrites work a student has already done.
create table if not exists decks (
  id text primary key,
  student_id text references students(id) on delete cascade,
  name text not null,
  -- The library deck this one was copied from, so the coach can see who has
  -- already been sent it. Nulled rather than cascaded: deleting a template
  -- must never delete a student's copy.
  source_deck_id text references decks(id) on delete set null,
  created_at timestamptz not null default now()
);

-- front = English, back = the student's own language. Leitner box 0 = new or
-- lapsed, 5 = mastered; due_date is when the card next comes up for review.
create table if not exists cards (
  id text primary key,
  deck_id text not null references decks(id) on delete cascade,
  front text not null,
  back text not null,
  example text not null default '',
  box integer not null default 0 check (box between 0 and 5),
  due_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_decks_student on decks(student_id);
create index if not exists idx_cards_deck on cards(deck_id);
