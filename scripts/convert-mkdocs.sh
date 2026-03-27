#!/usr/bin/env bash
# convert-mkdocs.sh — Convert MkDocs Material syntax to Fumadocs-compatible markdown
#
# Usage: ./scripts/convert-mkdocs.sh [directory]
#   directory: path to content directory (default: content/docs/anchor)
#
# This script is idempotent — safe to run multiple times on the same files.

set -euo pipefail

CONTENT_DIR="${1:-content/docs/anchor}"

if [ ! -d "$CONTENT_DIR" ]; then
  echo "Error: directory '$CONTENT_DIR' does not exist"
  exit 1
fi

echo "Converting MkDocs syntax in $CONTENT_DIR ..."

# Find all markdown files
FILES=$(find "$CONTENT_DIR" -name '*.md' -o -name '*.mdx' | sort)
MODIFIED=0

for file in $FILES; do
  CHANGED=false

  # 1. Remove icon shortcodes (:material-xxx: and :octicons-xxx:)
  if grep -qE ':(material|octicons)-[a-z0-9-]+:' "$file" 2>/dev/null; then
    sed -i '' -E 's/:(material|octicons)-[a-z0-9-]+://g' "$file"
    CHANGED=true
  fi

  # 2. Remove MkDocs icon frontmatter (icon: material/xxx)
  if grep -q '^icon: material/' "$file" 2>/dev/null; then
    sed -i '' '/^icon: material\//d' "$file"
    CHANGED=true
  fi

  # 3. Remove MkDocs hide frontmatter (hide: - toc, hide: - navigation)
  # Removes "hide:" line and subsequent "  - toc" / "  - navigation" lines
  if grep -q '^hide:' "$file" 2>/dev/null; then
    sed -i '' '/^hide:$/,/^[^ ]/{/^hide:$/d; /^  - /d;}' "$file"
    CHANGED=true
  fi

  # 4. Convert admonitions (!!! type "title") to GitHub-style callouts
  # !!! note "Title" -> > [!NOTE]
  # !!! warning -> > [!WARNING]
  if grep -qE '^!!! ' "$file" 2>/dev/null; then
    python3 -c "
import re, sys

with open('$file', 'r') as f:
    content = f.read()

def convert_admonition(match):
    indent = match.group(1)
    adm_type = match.group(2).upper()
    title = match.group(3)
    body = match.group(4)

    # Map MkDocs types to GitHub callout types
    type_map = {
        'NOTE': 'NOTE', 'INFO': 'NOTE', 'ABSTRACT': 'NOTE',
        'TIP': 'TIP', 'HINT': 'TIP',
        'WARNING': 'WARNING', 'CAUTION': 'CAUTION',
        'DANGER': 'CAUTION', 'FAILURE': 'CAUTION',
        'BUG': 'CAUTION', 'EXAMPLE': 'NOTE',
        'QUESTION': 'NOTE', 'QUOTE': 'NOTE',
    }
    callout_type = type_map.get(adm_type, 'NOTE')

    header = f'> [!{callout_type}]'
    if title:
        header += f' {title}'

    # Convert indented body to blockquote
    lines = body.rstrip().split('\n')
    quoted = []
    for line in lines:
        # Remove 4 spaces of indentation
        stripped = line[4:] if line.startswith('    ') else line
        quoted.append(f'> {stripped}' if stripped.strip() else '>')

    return header + '\n' + '\n'.join(quoted)

# Match admonition blocks: !!! type optional-title, then indented block
pattern = r'^( *)!!! (\w+)(?: \"([^\"]+)\")?\n((?:    .*\n?)*)'
content = re.sub(pattern, convert_admonition, content, flags=re.MULTILINE)

with open('$file', 'w') as f:
    f.write(content)
"
    CHANGED=true
  fi

  # 5. Remove <div class="grid cards" markdown> and </div> wrappers
  if grep -q '<div class="grid cards"' "$file" 2>/dev/null; then
    sed -i '' '/<div class="grid cards"/d' "$file"
    CHANGED=true
  fi

  # 6. Remove <div class="hero" markdown> and matching </div>
  if grep -q '<div class="hero"' "$file" 2>/dev/null; then
    sed -i '' '/<div class="hero"/d' "$file"
    CHANGED=true
  fi

  # 7. Remove closing </div> that were wrapping grid/hero blocks
  # Only remove standalone </div> lines (no other content)
  if grep -qE '^\s*</div>\s*$' "$file" 2>/dev/null; then
    sed -i '' '/^[[:space:]]*<\/div>[[:space:]]*$/d' "$file"
    CHANGED=true
  fi

  # 8. Remove markdown attribute from remaining divs
  if grep -q ' markdown>' "$file" 2>/dev/null; then
    sed -i '' 's/ markdown>/>/g' "$file"
    CHANGED=true
  fi
  if grep -q ' markdown=' "$file" 2>/dev/null; then
    sed -i '' 's/ markdown="[^"]*"//g' "$file"
    CHANGED=true
  fi

  # 9. Remove {: .class } attribute syntax
  if grep -qE '\{: *\.' "$file" 2>/dev/null; then
    sed -i '' -E 's/\{: *\.[^}]*\}//g' "$file"
    CHANGED=true
  fi

  # 10. Convert MkDocs tab syntax (=== "Tab") to heading sections
  if grep -q '=== "' "$file" 2>/dev/null; then
    sed -i '' -E 's/^=== "(.+)"/#### \1/' "$file"
    CHANGED=true
  fi

  if [ "$CHANGED" = true ]; then
    MODIFIED=$((MODIFIED + 1))
    echo "  converted: $file"
  fi
done

echo "Done. $MODIFIED file(s) modified."
