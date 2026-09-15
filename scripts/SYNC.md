# Syncing the Hook Farm corpus into this site

The harvest agent writes winners into `/workspace/viral-corpus/`.
This site is a **read-only browser** — it never collects.

## Automated sync (preferred)

```bash
./scripts/sync-corpus.sh
```

What it does:

1. Copies `INDEX.md`, `SCHEMA.md`, `cards/`, `thumbs/`, and `transcripts/` from `/workspace/viral-corpus/` into this repo’s `content/`.
2. Preserves `content/cards/.gitkeep` and `content/cards/_example.md.disabled`.
3. Never promotes source `*.disabled` files into the live card set (the site already ignores `*.disabled`).
4. If `content/` is unchanged → exits 0, no commit.
5. If changed → `git add content/`, commits `content: sync Hook Farm harvest <UTC stamp>`, pushes `origin/main`.
6. Prints a short summary: cards before/after, pushed yes/no, SHA.

Override the source path with `VIRAL_CORPUS_SRC=/path/to/corpus` if needed.

**Design Catalog** runs this script on a schedule and whenever Hook Farm signals a new harvest ping, so the public grid stays current without manual copy steps.

## Manual steps (fallback)

```bash
cp /workspace/viral-corpus/INDEX.md   content/INDEX.md
cp /workspace/viral-corpus/SCHEMA.md  content/SCHEMA.md
# live cards only — skip *.disabled
rsync -a --include='*.md' --include='*.json' --exclude='*.disabled' --exclude='*' \
  /workspace/viral-corpus/cards/ content/cards/
cp /workspace/viral-corpus/thumbs/* content/thumbs/           # optional
cp /workspace/viral-corpus/transcripts/* content/transcripts/ # optional

git add content/
git commit -m "content: sync Hook Farm harvest"
git push origin main
```

Keep `content/cards/.gitkeep` and `content/cards/_example.md.disabled` in place.

## Notes

- De-dupe key is canonical `url` (see `content/SCHEMA.md`).
- Card filenames: `YYYY-MM-DD-<slug>.md` or `.json`.
- Local thumbs are served via `public/thumbs` → `content/thumbs` (symlink).
- Collect-only constraint stays on the About page; this sync is display-only.
- Vercel (or your host) redeploys on push. Empty `content/cards/` shows the harvest-in-progress empty state.
