<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Brand colors: trust the code, not the docs

Brad's brand documents say the primary navy is `#1B2A4A`. The actual deployed
site uses `#132861` — defined as `--primary` in `src/app/globals.css` (teal
`--accent: #2abfbf` does match the docs). If you're redesigning or touching
styling, treat `globals.css` as the source of truth, not any external brief,
and flag it to Brad if you think the docs should be updated to match instead.

The portal app (`src/app/login/`) reads these same tokens via its own
`portal.css`, which layers `--portal-*` and `--dash-*` variables on top of
`--primary`/`--accent`. Changing the core brand colors in `globals.css` will
cascade into the portal too — check both surfaces before assuming a color
change is purely cosmetic on the marketing site.

## Where things live

The student/coach portal is at **`src/app/login/`**, not `src/app/portal/`.
The route is `/login`; `/portal` only survives as a redirect in
`next.config.ts`. Inside it: `lib/db.ts` (all SQL), `lib/income.ts` (every
money figure), `lib/schedule.ts` (class-date generation), `actions/` (server
actions, split coach/student), `components/`.

## The database is live production

`DATABASE_URL` in `.env.local` points at the **real** Neon database, with
Brad's actual students and contracts in it. There is no staging copy.

- To test anything that writes, create a throwaway student (name it
  `ZZ ...` so it sorts last), exercise the feature, then remove it via the
  coach UI's "Remove student" — the schema cascades and cleans up after it.
- Never edit a real student's contract to try something out. Editing a
  schedule regenerates that contract's future sessions and **deletes** the
  old ones; there is no undo and no history table.
- Read-only checks against the DB are fine and often the fastest way to
  verify a change actually landed.

## Schema changes

`sql/schema.sql` is the whole schema and is written to be re-runnable —
`create table if not exists` plus `alter table ... add column if not exists`,
with any backfill scoped so it can't clobber corrected data. There is no
migration tool: apply it by running the file against `DATABASE_URL` once
(a scratch Node script using `@neondatabase/serverless`'s `Client` works,
since the tagged-template `sql` helper can't run multi-statement scripts).
Applying it is a real change to production — confirm with Brad first.

## How the money maths is defined

Contracts are sold as four weeks of classes for a monthly fee. `lib/income.ts`
holds all of it, deliberately free of DB and React imports:

- **Net income** re-spreads each fee over the time a contract will really
  take. A rescheduled class adds a makeup on the end, so the same fee is
  earned over a longer stretch — a lower monthly rate. Brad's own example:
  4,000,000 over 8 classes with 4 rescheduled earns 2,666,667/month.
- **The monthly tracker** counts money banked, not billed: a class counts
  only once taught *and* its contract is marked paid. It starts at
  `INCOME_TRACKING_START` because earlier records are incomplete.
- `monthly_fee_amount` (numeric) is the source of truth; `monthly_fee` is
  only a display string derived from it.
- Class length lives on the **contract**, not the student, so past contracts
  keep the duration they were actually taught at.

## Uploads

Files travel through server actions, which Vercel caps at 4.5MB of request
body. `MAX_FILE_SIZE` in `lib/upload.ts` sits at 4MB to leave room for the
rest of the form, and the forms read the label from that constant rather than
repeating a number. Going higher means uploading from the browser straight to
blob storage (`@vercel/blob/client`), not raising the cap.

Deleting an assignment or submission deletes its blob too — orphaned files
stay billable forever otherwise.

## Deployment

The site is hosted on **Vercel**, not GitHub Pages; GitHub only stores the
source. Postgres is Neon, file uploads are Vercel Blob. Anything requiring a
server (the whole portal) depends on that.
