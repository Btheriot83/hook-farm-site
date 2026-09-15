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

preserve_dir="$(mktemp -d)"
trap 'rm -rf "$preserve_dir"' EXIT

# Preserve site-local sentinels (cards + empty-tree gitkeeps)
preserve_file() {
  local rel="$1"
  if [[ -e "$DEST/$rel" ]]; then
    mkdir -p "$preserve_dir/$(dirname "$rel")"
    cp -a "$DEST/$rel" "$preserve_dir/$rel"
  fi
}
preserve_file "cards/.gitkeep"
preserve_file "cards/_example.md.disabled"
preserve_file "thumbs/.gitkeep"
preserve_file "transcripts/.gitkeep"

# INDEX + SCHEMA
[[ -f "$SRC/INDEX.md" ]] && cp -a "$SRC/INDEX.md" "$DEST/INDEX.md"
[[ -f "$SRC/SCHEMA.md" ]] && cp -a "$SRC/SCHEMA.md" "$DEST/SCHEMA.md"

sync_cards() {
  find "$DEST/cards" -maxdepth 1 \( -name '*.md' -o -name '*.json' \) ! -name '*.disabled' -delete 2>/dev/null || true
  if [[ -d "$SRC/cards" ]]; then
    find "$SRC/cards" -maxdepth 1 \( -name '*.md' -o -name '*.json' \) ! -name '*.disabled' -print0 \
      | while IFS= read -r -d '' f; do
          cp -a "$f" "$DEST/cards/"
        done
  fi
}

sync_tree() {
  local from="$1" to="$2"
  mkdir -p "$to"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete --exclude='.gitkeep' "$from/" "$to/"
  else
    find "$to" -mindepth 1 -maxdepth 1 ! -name '.gitkeep' -exec rm -rf {} +
    if [[ -d "$from" ]] && [[ -n "$(ls -A "$from" 2>/dev/null || true)" ]]; then
      # copy contents; do not clobber a preserved .gitkeep if source lacks one
      for item in "$from"/* "$from"/.[!.]* "$from"/..?*; do
        [[ -e "$item" ]] || continue
        base="$(basename "$item")"
        [[ "$base" == "." || "$base" == ".." ]] && continue
        cp -a "$item" "$to/"
      done
    fi
  fi
}

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --include='*/' \
    --include='*.md' \
    --include='*.json' \
    --exclude='*.disabled' \
    --exclude='*' \
    "$SRC/cards/" "$DEST/cards/"
else
  sync_cards
fi

restore_file() {
  local rel="$1"
  if [[ -e "$preserve_dir/$rel" ]]; then
    mkdir -p "$DEST/$(dirname "$rel")"
    cp -a "$preserve_dir/$rel" "$DEST/$rel"
  fi
}
restore_file "cards/.gitkeep"
restore_file "cards/_example.md.disabled"

# Drop non-example disabled files that should not sit in dest
find "$DEST/cards" -maxdepth 1 -name '*.disabled' ! -name '_example.md.disabled' -delete 2>/dev/null || true

if [[ -d "$SRC/thumbs" ]]; then
  sync_tree "$SRC/thumbs" "$DEST/thumbs"
fi
if [[ -d "$SRC/transcripts" ]]; then
  sync_tree "$SRC/transcripts" "$DEST/transcripts"
fi

restore_file "thumbs/.gitkeep"
restore_file "transcripts/.gitkeep"

cards_after=$(find "$DEST/cards" -maxdepth 1 \( -name '*.md' -o -name '*.json' \) ! -name '*.disabled' 2>/dev/null | wc -l | tr -d ' ')

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
