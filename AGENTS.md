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

The `/portal` app (`src/app/portal/`) reads these same tokens via its own
`portal.css`, which layers `--portal-*` variables on top of `--primary`/
`--accent`. Changing the core brand colors in `globals.css` will cascade into
the portal too — check both surfaces before assuming a color change is purely
cosmetic on the marketing site.
