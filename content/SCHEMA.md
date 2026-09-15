# Viral corpus card schema

One card per winning piece. Filename: `cards/YYYY-MM-DD-<slug>.md` (or `.json`). De-dupe by canonical `url`.

## Required fields

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | Same as filename slug without date, or full `YYYY-MM-DD-slug` |
| `collected_at` | ISO-8601 | When Hook Farm saved the card (America/Phoenix) |
| `platform` | enum | `youtube` \| `tiktok` \| `instagram` \| `facebook` \| `x` |
| `category` | enum | Primary corpus lane: `ai` \| `true_crime` \| `diesel` \| `rideshare` |
| `url` | string | Canonical public URL (de-dupe key) |
| `creator_handle` | string | e.g. `@channel` or channel name |
| `title` | string | Video title or caption headline |
| `hook_onscreen` | string | On-screen text in first seconds (empty if none) |
| `hook_spoken` | string | First spoken line if different from on-screen |
| `thumbnail_path` | string | Relative path under `thumbs/` |
| `thumbnail_url` | string | Source CDN/page URL if known |
| `transcript_30s` | string | Verbatim first ~30s; also mirrored under `transcripts/` |
| `transcript_path` | string | Relative path under `transcripts/` (optional if inline) |
| `views` | number\|null | Approx if visible |
| `likes` | number\|null | |
| `comments` | number\|null | |
| `saves` | number\|null | When platform shows |
| `post_date` | string\|null | ISO date or platform display string |
| `niche_tags` | string[] | e.g. `chatgpt`, `agents`, `tooling`, `money`, `how-to` |
| `pattern_tags` | string[] | Packaging craft: `curiosity_gap`, `number`, `before_after`, `authority`, `demo_first`, `list`, `negative`, `secret`, `replaced_job`, etc. |
| `format` | enum | `short` \| `long` \| `text` \| `carousel` |
| `notes` | string | Optional harvest notes / why it looked viral |

## Markdown card template

```markdown
---
id: 2026-09-14-example-slug
collected_at: 2026-09-14T23:30:00-07:00
platform: youtube
category: ai
url: https://...
creator_handle: "@Creator"
title: "..."
hook_onscreen: "..."
hook_spoken: "..."
thumbnail_path: thumbs/2026-09-14-example-slug.jpg
thumbnail_url: https://...
transcript_path: transcripts/2026-09-14-example-slug.txt
views: 1200000
likes: 45000
comments: 2100
saves: null
post_date: "2026-08-01"
niche_tags: [chatgpt, how-to, ai]
# true_crime cards use niche_tags like: true_crime, murder, missing, courtroom, faceless, narration
pattern_tags: [curiosity_gap, number]
format: short
notes: ""
---

## Transcript (~30s)

(verbatim text here)
```

## Constraints

- Collect only. Never like, comment, follow, post, or DM.
- Public content only.
- Prefer high views relative to account size / clear viral markers.
- Seed lanes: `ai`, `true_crime`, `diesel` (mobile diesel / semi truck / heavy-duty repair), `rideshare` (Uber / Lyft / gig driving) (separate via `category`). pattern_tags stay niche-agnostic for transfer.
- Prefer **faceless** true-crime packaging (narration / B-roll / text-on-screen). Face-on refs (e.g. Ray William Johnson) only as sparse style benchmarks, tagged `faceless: false` in notes.
- Stay out of Edward Clipperhands / Love & Crime master editing — packaging examples only.
