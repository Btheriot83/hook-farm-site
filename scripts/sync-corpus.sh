#!/usr/bin/env bash
# Sync Hook Farm harvest from /workspace/viral-corpus into this site's content/.
# Safe to run on a schedule (Design Catalog) or on Hook Farm pings.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${VIRAL_CORPUS_SRC:-/workspace/viral-corpus}"
DEST="${ROOT}/content"

cd "$ROOT"

if [[ ! -d "$SRC" ]]; then
  echo "error: source corpus not found: $SRC" >&2
  exit 1
fi

cards_before=$(find "$DEST/cards" -maxdepth 1 \( -name '*.md' -o -name '*.json' \) ! -name '*.disabled' 2>/dev/null | wc -l | tr -d ' ')

mkdir -p "$DEST/cards" "$DEST/thumbs" "$DEST/transcripts"

# Preserve site-local sentinels across rsync --delete
preserve_dir="$(mktemp -d)"
trap 'rm -rf "$preserve_dir"' EXIT
for f in .gitkeep _example.md.disabled; do
  if [[ -e "$DEST/cards/$f" ]]; then
    cp -a "$DEST/cards/$f" "$preserve_dir/$f"
  fi
done

# INDEX + SCHEMA
if [[ -f "$SRC/INDEX.md" ]]; then
  cp -a "$SRC/INDEX.md" "$DEST/INDEX.md"
fi
if [[ -f "$SRC/SCHEMA.md" ]]; then
  cp -a "$SRC/SCHEMA.md" "$DEST/SCHEMA.md"
fi

# Cards: live .md / .json only — never promote *.disabled from source
rsync -a --delete \
  --include='*/' \
  --include='*.md' \
  --include='*.json' \
  --exclude='*.disabled' \
  --exclude='*' \
  "$SRC/cards/" "$DEST/cards/"

# Restore preserved sentinels (and never leave source *.disabled as live)
for f in .gitkeep _example.md.disabled; do
  if [[ -e "$preserve_dir/$f" ]]; then
    cp -a "$preserve_dir/$f" "$DEST/cards/$f"
  fi
done
# Drop any disabled files that slipped in from source as "live" names
find "$DEST/cards" -maxdepth 1 -name '*.disabled' ! -name '_example.md.disabled' -delete 2>/dev/null || true

# Thumbs + transcripts (optional trees)
if [[ -d "$SRC/thumbs" ]]; then
  rsync -a --delete "$SRC/thumbs/" "$DEST/thumbs/"
fi
if [[ -d "$SRC/transcripts" ]]; then
  rsync -a --delete "$SRC/transcripts/" "$DEST/transcripts/"
fi

cards_after=$(find "$DEST/cards" -maxdepth 1 \( -name '*.md' -o -name '*.json' \) ! -name '*.disabled' 2>/dev/null | wc -l | tr -d ' ')

# Ensure public/thumbs points at content/thumbs for next/image static serve
mkdir -p "$ROOT/public"
if [[ ! -e "$ROOT/public/thumbs" ]]; then
  ln -sfn ../content/thumbs "$ROOT/public/thumbs"
fi

changed="$(git status --porcelain -- content/ || true)"
if [[ -z "$changed" ]]; then
  echo "sync: no content changes"
  echo "cards: ${cards_before} → ${cards_after}"
  echo "pushed: no"
  echo "sha: $(git rev-parse HEAD)"
  exit 0
fi

git add content/
stamp="$(date -u +%Y-%m-%dT%H%MZ)"
git commit -m "content: sync Hook Farm harvest ${stamp}"
git push origin main

echo "sync: content updated"
echo "cards: ${cards_before} → ${cards_after}"
echo "pushed: yes"
echo "sha: $(git rev-parse HEAD)"
