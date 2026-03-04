#!/usr/bin/env python3
"""
build-i18n.py – Park Babelsberg EN Static Site Generator
=========================================================
Generates static English (/en/) versions of all German HTML pages.

Usage:
    python3 build-i18n.py [--dry-run] [--file <slug>]

What it does:
  1. Reads each DE HTML file from park-babelsberg/
  2. Applies EN meta translations from en-page-meta.json
  3. Swaps structural elements (lang, canonical, hreflang, breadcrumb, footer)
  4. Outputs to park-babelsberg/en/[same-path].html
  5. Adds hreflang links to the original DE files
"""

import os
import re
import sys
import json
import shutil
import argparse
from pathlib import Path

# ─── Config ──────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent / "park-babelsberg"
EN_DIR     = BASE_DIR / "en"
META_FILE  = BASE_DIR / "assets" / "translations" / "pages" / "en-page-meta.json"
BASE_URL   = "https://park.babelsberger.info/park-babelsberg"

SKIP_PATTERNS = [
    "en/", "backup", "index-backup", "modules/", "test-"
]

SKIP_FILES = {"favicon.svg"}

# German → English breadcrumb patterns
BREADCRUMB_DE = [
    "← Zurück zur Übersicht Park Babelsberg",
    "← Zurück zur Übersicht",
    "← Zurück zum Magazin",
    "← Zurück",
    "← Back to overview",  # already-English stubs
]
BREADCRUMB_EN_DEFAULT = "← Back to Overview"

# Footer common German text in footer
FOOTER_REPLACEMENTS = [
    ("Stand: 2025-10-31 • SPSG-Parkordnung", "As of 2026 • SPSG Park Regulations"),
    ("Stand: 2026-03-04", "As of 2026-03-04"),
    ("Daten: © OpenStreetMap-Mitwirkende", "Data: © OpenStreetMap contributors"),
]

# ─── Load meta translations ───────────────────────────────────────────────────
def load_meta() -> dict:
    if not META_FILE.exists():
        print(f"[WARN] Meta file not found: {META_FILE}")
        return {}
    with open(META_FILE, encoding="utf-8") as f:
        return json.load(f)


# ─── File helpers ─────────────────────────────────────────────────────────────
def get_slug(html_path: Path) -> str:
    """Convert path to slug key. E.g., blog/jogging-routen.html → blog/jogging-routen"""
    rel = html_path.relative_to(BASE_DIR)
    return str(rel.with_suffix(""))


def should_skip(path: Path) -> bool:
    rel = str(path.relative_to(BASE_DIR))
    if path.name in SKIP_FILES:
        return True
    for pat in SKIP_PATTERNS:
        if pat in rel:
            return True
    return False


def collect_html_files() -> list[Path]:
    files = []
    for f in BASE_DIR.rglob("*.html"):
        if not should_skip(f):
            files.append(f)
    return sorted(files)


# ─── HTML manipulation ────────────────────────────────────────────────────────
def replace_tag_attr(html: str, tag: str, attr: str, pattern: str, replacement: str) -> str:
    """Replace an attribute value inside a specific tag."""
    def replacer(m):
        return m.group(0).replace(m.group(1), replacement)
    rx = re.compile(
        rf'(<{tag}[^>]*\s{attr}=")([^"]*)(">)',
        re.IGNORECASE
    )
    return rx.sub(lambda m: m.group(0).replace(m.group(2), replacement), html)


def set_lang(html: str, lang: str) -> str:
    return re.sub(r'<html([^>]*)\slang="[^"]*"', f'<html\\1 lang="{lang}"', html, count=1)


def set_meta_title(html: str, title: str) -> str:
    return re.sub(r'<title>[^<]*</title>', f'<title>{title}</title>', html, count=1)


def set_meta_description(html: str, desc: str) -> str:
    return re.sub(
        r'(<meta\s+name="description"\s+content=")[^"]*(")',
        f'\\g<1>{desc}\\g<2>',
        html, count=1, flags=re.IGNORECASE
    )


def set_og_meta(html: str, prop: str, value: str) -> str:
    return re.sub(
        rf'(<meta\s+property="og:{prop}"\s+content=")[^"]*(")',
        f'\\g<1>{value}\\g<2>',
        html, count=1, flags=re.IGNORECASE
    )


def set_og_locale(html: str, locale: str) -> str:
    return re.sub(
        r'(<meta\s+property="og:locale"\s+content=")[^"]*(")',
        f'\\g<1>{locale}\\g<2>',
        html, count=1, flags=re.IGNORECASE
    )


def set_canonical(html: str, en_url: str) -> str:
    return re.sub(
        r'<link\s+rel="canonical"\s+href="[^"]*"',
        f'<link rel="canonical" href="{en_url}"',
        html, count=1, flags=re.IGNORECASE
    )


def build_hreflang(de_url: str, en_url: str) -> str:
    return (
        f'<link rel="alternate" hreflang="de" href="{de_url}">\n'
        f'  <link rel="alternate" hreflang="en" href="{en_url}">\n'
        f'  <link rel="alternate" hreflang="x-default" href="{de_url}">'
    )


def inject_hreflang(html: str, de_url: str, en_url: str) -> str:
    """Remove existing hreflang/x-default and inject fresh ones."""
    html = re.sub(
        r'\s*<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\n?',
        '',
        html, flags=re.IGNORECASE
    )
    hreflang = build_hreflang(de_url, en_url)
    # Insert before </head>
    return html.replace('</head>', f'  {hreflang}\n</head>', 1)


def replace_breadcrumb(html: str, en_breadcrumb: str) -> str:
    for de_text in BREADCRUMB_DE:
        if de_text in html:
            html = html.replace(de_text, en_breadcrumb, 1)
            break
    return html


def apply_footer_replacements(html: str) -> str:
    for de, en in FOOTER_REPLACEMENTS:
        html = html.replace(de, en)
    return html


def fix_asset_paths_for_en(html: str) -> str:
    """Fix relative asset paths: in /en/ subdirectory, paths need ../prefix."""
    # Stylesheet and script paths
    for tag_type in ['href="assets/', 'src="assets/', 'href="images/', 'src="images/']:
        html = html.replace(tag_type, tag_type.replace('"', '"../'))
    # Favicon
    html = html.replace('href="favicon.svg"', 'href="../favicon.svg"')
    return html


def fix_link_paths_for_en(html: str) -> str:
    """Fix internal links in /en/ subdirectory: href="xyz.html" → href="../xyz.html" """
    # Match href values that are local .html files (not http, not #, not ../)
    def fix_href(m):
        val = m.group(1)
        # Skip external, fragment, already-relative-up, or /en/ paths
        if val.startswith(('http', '#', '../', '/en/', '/')):
            return m.group(0)
        # Skip assets
        if val.startswith(('assets/', 'images/')):
            return m.group(0)
        # Blog internal links
        if val.startswith('blog/'):
            return f'href="../{val}'
        # .html files
        if val.endswith('.html'):
            return f'href="../{val}'
        return m.group(0)

    html = re.sub(r'href="([^"]*)"', fix_href, html)
    return html


def add_lang_toggle_script(html: str) -> str:
    """Ensure lang-toggle.js is included."""
    if 'lang-toggle.js' in html:
        return html
    # Add before </body>
    return html.replace(
        '</body>',
        '<script src="../assets/lang-toggle.js" defer></script>\n</body>',
        1
    )


# ─── EN page generation ───────────────────────────────────────────────────────
def build_en_page(de_path: Path, meta: dict, dry_run: bool = False) -> bool:
    slug = get_slug(de_path)
    page_meta = meta.get(slug, {})

    with open(de_path, encoding="utf-8") as f:
        html = f.read()

    # ── URL computation ──────────────────────────────────────────────────────
    rel_path = de_path.relative_to(BASE_DIR)
    de_url = f"{BASE_URL}/{rel_path.as_posix()}"
    en_url = f"{BASE_URL}/en/{rel_path.as_posix()}"

    # ── Language ─────────────────────────────────────────────────────────────
    html = set_lang(html, "en")

    # ── Meta title / description ──────────────────────────────────────────────
    if page_meta.get("title"):
        html = set_meta_title(html, page_meta["title"])
    if page_meta.get("description"):
        html = set_meta_description(html, page_meta["description"])

    # ── OG meta ──────────────────────────────────────────────────────────────
    if page_meta.get("og_title"):
        html = set_og_meta(html, "title", page_meta["og_title"])
    if page_meta.get("og_description"):
        html = set_og_meta(html, "description", page_meta["og_description"])
    html = set_og_locale(html, "en_US")
    html = set_og_meta(html, "url", en_url)

    # ── Canonical ─────────────────────────────────────────────────────────────
    html = set_canonical(html, en_url)

    # ── hreflang ─────────────────────────────────────────────────────────────
    html = inject_hreflang(html, de_url, en_url)

    # ── Breadcrumb ────────────────────────────────────────────────────────────
    bc = page_meta.get("breadcrumb", BREADCRUMB_EN_DEFAULT)
    html = replace_breadcrumb(html, bc)

    # ── Footer text ───────────────────────────────────────────────────────────
    html = apply_footer_replacements(html)

    # ── Asset paths ───────────────────────────────────────────────────────────
    html = fix_asset_paths_for_en(html)

    # ── Internal link paths ───────────────────────────────────────────────────
    html = fix_link_paths_for_en(html)

    # ── lang-toggle.js ────────────────────────────────────────────────────────
    html = add_lang_toggle_script(html)

    # ── Write output ──────────────────────────────────────────────────────────
    en_path = EN_DIR / rel_path
    if dry_run:
        print(f"[DRY] Would write: {en_path}")
        return True

    en_path.parent.mkdir(parents=True, exist_ok=True)
    with open(en_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"[OK]  {rel_path} → en/{rel_path}")
    return True


# ─── hreflang injection into DE originals ────────────────────────────────────
def add_hreflang_to_de(de_path: Path, dry_run: bool = False) -> None:
    rel_path = de_path.relative_to(BASE_DIR)
    de_url = f"{BASE_URL}/{rel_path.as_posix()}"
    en_url = f"{BASE_URL}/en/{rel_path.as_posix()}"

    with open(de_path, encoding="utf-8") as f:
        html = f.read()

    updated = inject_hreflang(html, de_url, en_url)

    if updated == html:
        return  # Nothing changed

    if dry_run:
        print(f"[DRY] Would update hreflang in: {rel_path}")
        return

    with open(de_path, "w", encoding="utf-8") as f:
        f.write(updated)
    print(f"[hreflang] Updated: {rel_path}")


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Build EN static pages")
    parser.add_argument("--dry-run", action="store_true", help="Preview only, no writes")
    parser.add_argument("--file", help="Process only this slug (e.g. flatowturm)")
    parser.add_argument("--skip-hreflang", action="store_true", help="Skip updating DE files")
    args = parser.parse_args()

    meta = load_meta()
    files = collect_html_files()

    if args.file:
        files = [f for f in files if args.file in str(f)]
        if not files:
            print(f"[ERROR] No file matching '{args.file}'")
            sys.exit(1)

    ok = skipped = errors = 0

    for de_path in files:
        try:
            build_en_page(de_path, meta, dry_run=args.dry_run)
            if not args.skip_hreflang and not args.dry_run:
                add_hreflang_to_de(de_path, dry_run=False)
            ok += 1
        except Exception as e:
            print(f"[ERR] {de_path.name}: {e}")
            errors += 1

    print(f"\n✅ Done: {ok} pages built, {errors} errors.")
    if args.dry_run:
        print("   (dry run – no files written)")


if __name__ == "__main__":
    main()
