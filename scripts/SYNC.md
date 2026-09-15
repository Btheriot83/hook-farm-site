# Syncing the Hook Farm corpus into this site

The harvest agent writes winners into `/workspace/viral-corpus/`.
This site is a **read-only browser** — it never collects. To publish new cards:

## Steps

1. Copy from the agent workspace into this repo’s content tree:

   ```bash
   # From a machine that has both trees mounted:
   cp /workspace/viral-corpus/INDEX.md   content/INDEX.md
   cp /workspace/viral-corpus/SCHEMA.md  content/SCHEMA.md
   cp /workspace/viral-corpus/cards/*    content/cards/     # *.md and *.json
   cp /workspace/viral-corpus/thumbs/*   content/thumbs/    # optional
   cp /workspace/viral-corpus/transcripts/* content/transcripts/  # optional
   ```

2. Do **not** copy `_example.md.disabled` into the live set; the site ignores `*.disabled`.

3. Commit and push `main`:

   ```bash
   cd /workspace/hook-farm-site
   git add content/
   git commit -m "content: sync Hook Farm harvest"
   git push origin main
   ```

4. Vercel (or your host) redeploys. The home grid rebuilds from `content/cards/` at build time — empty folders show the harvest-in-progress empty state; new files appear after the next deploy.

## Notes

- De-dupe key is canonical `url` (see `content/SCHEMA.md`).
- Card filenames: `YYYY-MM-DD-<slug>.md` or `.json`.
- Collect-only constraint stays on the About page; this sync is display-only.
