#!/usr/bin/env python3
"""
add-lang-toggle.py – Inject lang-toggle.js into all park-babelsberg HTML pages
that don't already have it.
"""
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent / "park-babelsberg"

SKIP_PATTERNS = ["en/", "backup", "index-backup", "modules/", "test-"]

def should_skip(path: Path) -> bool:
    rel = str(path.relative_to(BASE_DIR))
    return any(p in rel for p in SKIP_PATTERNS)

def get_script_tag(path: Path) -> str:
    """Return the correct relative path for lang-toggle.js."""
    rel = path.relative_to(BASE_DIR)
    depth = len(rel.parts) - 1  # 0 for root, 1 for blog/ etc.
    prefix = "../" * depth
    return f'<script src="{prefix}assets/lang-toggle.js" defer></script>'

files = sorted(BASE_DIR.rglob("*.html"))
updated = skipped = already = 0

for f in files:
    if should_skip(f):
        skipped += 1
        continue

    html = f.read_text(encoding="utf-8")

    if "lang-toggle.js" in html:
        already += 1
        continue

    # Insert before </body>
    tag = get_script_tag(f)
    if "</body>" not in html:
        print(f"[SKIP] No </body> found: {f.name}")
        skipped += 1
        continue

    html = html.replace("</body>", f"{tag}\n</body>", 1)
    f.write_text(html, encoding="utf-8")
    print(f"[OK] {f.relative_to(BASE_DIR)}")
    updated += 1

print(f"\n✅ Done: {updated} updated, {already} already had it, {skipped} skipped.")
