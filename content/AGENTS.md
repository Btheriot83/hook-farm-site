# Hook Farm corpus — agent guide

Read-only packaging training corpus. **Never** like, comment, follow, or post.

## Layout
- `SCHEMA.md` — required card fields
- `INDEX.md` — master table (de-dupe by `url`)
- `cards/*.md` — one card per piece (YAML frontmatter + transcript)
- `thumbs/` — thumbnail images referenced by `thumbnail_path`
- `transcripts/` — first ~30s text
- `CRITIQUE.md` / `TOP_CREATORS.md` — quality review outputs (when present)
- `AGENTS.md` — this file

## Categories (`category` field)
| category | Use for |
|----------|---------|
| `ai` | ChatGPT, Claude, Cursor, agents, tools, prompts |
| `true_crime` | True crime / dark storytelling packaging (prefer faceless) |
| `diesel` | Mobile diesel repair, semi/heavy truck, fleet roadside |
| `rideshare` | Uber, Lyft, gig driving packaging |

Also use `niche_tags` for finer filters (e.g. `faceless`, `chatgpt`, `semi`, `uber`).

## How agents should query
1. Filter `INDEX.md` or glob `cards/` by `category:` then `niche_tags` / `pattern_tags`.
2. Load full card for title, hooks, transcript_30s, engagement.
3. Prefer high `views` relative to format; skip cards with `notes` containing "weak" or missing thumbs.
4. Pattern tags are **niche-agnostic** packaging craft for transfer learning.

## Site
Public browser: https://hook-farm-site.vercel.app — Design Catalog owns sync/deploy from this folder.
Site should expose category filters + machine-readable index for agents (JSON feed preferred).
