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
  added_date date not null default current_date
);

create table if not exists assignments (
  id text primary key,
  student_id text not null references students(id) on delete cascade,
  title text not null,
  type text not null check (type in ('Homework', 'Material', 'Resource')),
  description text not null default '',
  url text not null default '',
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
