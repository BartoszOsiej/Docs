#!/usr/bin/env python3
"""
Docusaurus Frontmatter Automation — SEO Injector
=================================================

Walks a Docs/ directory tree, reads every .md/.mdx file, and injects
optimal YAML frontmatter (description + keywords) based on the file's
title, headings, and content.

If frontmatter already exists, it updates `description` and `keywords`
fields. If not, it creates the YAML block at the top of the file.

Usage:
    python3 inject-frontmatter.py /path/to/Docs/
    python3 inject-frontmatter.py /path/to/Docs/ --dry-run
    python3 inject-frontmatter.py /path/to/Docs/ --force

Requirements: Python 3.8+ (no external dependencies)
"""

import argparse
import os
import re
import sys
from pathlib import Path
from typing import Optional

# ─── Keyword Extraction Rules ────────────────────────────────────────────────

# Domain-specific keyword map: substring in title/content → keyword
KEYWORD_MAP = {
    # Languages & Tech
    "rust": "Rust",
    "python": "Python",
    "bash": "Bash",
    "c language": "C",
    "typescript": "TypeScript",
    "javascript": "JavaScript",
    # Systems
    "ebpf": "eBPF",
    "linux kernel": "Linux kernel",
    "kernel": "kernel",
    "lsm": "Linux Security Module",
    "security module": "Linux Security Module",
    "risc-v": "RISC-V",
    "riscv": "RISC-V",
    "wgpu": "wgpu",
    "voxel": "voxel engine",
    # Crypto
    "ml-kem": "ML-KEM-768",
    "post-quantum": "post-quantum cryptography",
    "aes-256": "AES-256-GCM",
    "sha-256": "SHA-256",
    "encryption": "encryption",
    "cryptography": "cryptography",
    # Domain
    "compiler": "compiler",
    "parser": "parser",
    "ast": "AST",
    "ransomware": "ransomware",
    "malware": "malware detection",
    "network": "networking",
    "filesystem": "filesystem",
    "operating system": "operating system",
    "browser": "browser",
    "multiplayer": "multiplayer",
    "ecs": "ECS",
    "neural": "neural renderer",
    "render": "rendering",
    # Books
    "stitcher": "The Stitcher Trilogy",
    "curator": "The Stitcher Trilogy",
    "reckoning": "The Stitcher Trilogy",
    "horror": "crime horror",
    "thriller": "thriller",
    "fiction": "fiction",
    # Docs categories
    "architecture": "architecture",
    "tutorial": "tutorial",
    "getting started": "getting started",
    "configuration": "configuration",
    "api reference": "API reference",
    "deployment": "deployment",
    "testing": "testing",
    "benchmark": "benchmark",
    "performance": "performance",
    "security": "security",
    "contributing": "contributing",
    "changelog": "changelog",
    "license": "license",
}

# ─── Title / Description Extraction ──────────────────────────────────────────

def extract_title_from_content(content: str) -> Optional[str]:
    """Extract the first H1 heading from markdown content."""
    for line in content.split("\n"):
        line = line.strip()
        if line.startswith("# ") and not line.startswith("## "):
            return line[2:].strip()
    return None


def extract_title_from_filename(filepath: Path) -> str:
    """Derive a human-readable title from the filename."""
    stem = filepath.stem
    # Remove common prefixes
    for prefix in ("index", "README", "readme"):
        if stem.lower() == prefix.lower():
            return filepath.parent.name.replace("-", " ").replace("_", " ").title()
    return stem.replace("-", " ").replace("_", " ").replace(".", " ").title()


def extract_keywords(content: str, title: str) -> list[str]:
    """Extract relevant keywords from title + content."""
    combined = (title + " " + content[:2000]).lower()
    found = []
    seen = set()

    for pattern, keyword in sorted(KEYWORD_MAP.items(), key=lambda x: -len(x[0])):
        if pattern in combined and keyword not in seen:
            found.append(keyword)
            seen.add(keyword)
        if len(found) >= 8:
            break

    return found


def generate_description(title: str, content: str) -> str:
    """Generate a concise SEO description from the title and first paragraph."""
    # Try to find the first non-empty paragraph after the title
    lines = content.split("\n")
    past_title = False
    description_parts = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("# ") and not past_title:
            past_title = True
            continue
        if past_title and stripped and not stripped.startswith("#"):
            # Skip metadata lines, HTML, links
            if stripped.startswith("---") or stripped.startswith("<") or stripped.startswith(">") or stripped.startswith("|"):
                continue
            if stripped.startswith("[") or stripped.startswith("!"):
                continue
            description_parts.append(stripped)
            if len(" ".join(description_parts)) >= 120:
                break
        elif past_title and stripped.startswith("#"):
            break

    raw = " ".join(description_parts).strip()
    if not raw:
        raw = f"Documentation for {title}."

    # Trim to 150-160 chars for SEO
    if len(raw) > 160:
        raw = raw[:157].rsplit(" ", 1)[0] + "..."

    # YAML-safe: double quotes inside a double-quoted scalar break the block
    raw = raw.replace('"', "'")

    return raw


def generate_keywords_string(title: str, content: str, project_name: str) -> str:
    """Generate a comma-separated keywords string."""
    keywords = extract_keywords(content, title)
    # Always include the project name
    if project_name and project_name not in keywords:
        keywords.insert(0, project_name)
    # Always include "documentation"
    if "documentation" not in keywords:
        keywords.append("documentation")
    # Docusaurus requires `keywords` frontmatter to be an ARRAY, not a string
    return keywords[:10]


# ─── Frontmatter Parsing / Injection ─────────────────────────────────────────

FRONTMATTER_PATTERN = re.compile(
    r"^---\s*\n(.*?)\n---\s*\n",
    re.DOTALL,
)


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse existing YAML frontmatter from content. Returns (fields, body)."""
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        return {}, content

    raw_yaml = match.group(1)
    body = content[match.end():]
    fields = {}

    # Simple YAML parser (no dependencies)
    current_key = None
    current_value_lines = []

    for line in raw_yaml.split("\n"):
        if line.startswith("  ") and current_key:
            current_value_lines.append(line.strip())
        elif ":" in line:
            if current_key:
                fields[current_key] = " ".join(current_value_lines) if current_value_lines else ""
            parts = line.split(":", 1)
            current_key = parts[0].strip()
            value = parts[1].strip()
            # Strip surrounding quotes from existing values
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            if value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            if value.startswith("[") and value.endswith("]"):
                # Inline array
                fields[current_key] = value
                current_key = None
                current_value_lines = []
            elif value:
                fields[current_key] = value
                current_key = None
                current_value_lines = []
            else:
                current_value_lines = []

        if current_key:
            fields[current_key] = " ".join(current_value_lines) if current_value_lines else ""

    return fields, body


def build_frontmatter(fields: dict) -> str:
    """Build a YAML frontmatter block from fields dict."""
    lines = ["---"]
    for key, value in fields.items():
        if isinstance(value, list):
            safe = ['"' + str(v).replace(chr(34), chr(92) + chr(34)) + '"' for v in value]
            lines.append(f"{key}: [{', '.join(safe)}]")
        elif value:
            value = str(value).replace(chr(34), chr(39))
            lines.append(f'{key}: "{value}"')
    lines.append("---")
    return "\n".join(lines) + "\n"


# ─── Main Processing ─────────────────────────────────────────────────────────

def process_file(
    filepath: Path,
    project_name: str,
    dry_run: bool = False,
    force: bool = False,
) -> bool:
    """Process a single markdown file. Returns True if modified."""
    content = filepath.read_text(encoding="utf-8")
    existing, body = parse_frontmatter(content)

    title = extract_title_from_content(body) or extract_title_from_filename(filepath)
    description = generate_description(title, body)
    keywords = generate_keywords_string(title, body, project_name)

    # Determine what to update
    new_fields = dict(existing)
    changed = False

    if force or "description" not in new_fields or not new_fields["description"]:
        if new_fields.get("description") != description:
            new_fields["description"] = description
            changed = True

    if force or "keywords" not in new_fields or not new_fields["keywords"]:
        if new_fields.get("keywords") != keywords:
            new_fields["keywords"] = keywords
            changed = True

    if force or "title" not in new_fields or not new_fields["title"]:
        if new_fields.get("title") != title:
            new_fields["title"] = title
            changed = True

    if not changed:
        return False

    if dry_run:
        print(f"  [DRY] {filepath.relative_to(filepath.parent.parent)}")
        print(f"        title: {title}")
        print(f"        description: {description[:80]}...")
        print(f"        keywords: {keywords}")
        return True

    new_content = build_frontmatter(new_fields) + body
    filepath.write_text(new_content, encoding="utf-8")
    print(f"  ✓ {filepath.relative_to(filepath.parent.parent)}")
    return True


def find_docs_root(start: Path) -> Optional[Path]:
    """Find the Docs/ directory starting from a path."""
    candidates = [start / "Docs", start / "docs", start / "docs-hub"]
    for c in candidates:
        if c.is_dir():
            return c
    # Search one level up
    parent = start.parent
    for c in [parent / "Docs", parent / "docs", parent / "docs-hub"]:
        if c.is_dir():
            return c
    return None


def main():
    parser = argparse.ArgumentParser(
        description="Inject SEO frontmatter into Docusaurus markdown files"
    )
    parser.add_argument(
        "docs_path",
        help="Path to the Docs/ directory",
    )
    parser.add_argument(
        "--project",
        default="",
        help="Project name to include in keywords (e.g., 'linux-aegis')",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing frontmatter fields",
    )
    args = parser.parse_args()

    docs_path = Path(args.docs_path).resolve()
    if not docs_path.is_dir():
        print(f"Error: {docs_path} is not a directory", file=sys.stderr)
        sys.exit(1)

    # Auto-detect project name from directory
    project_name = args.project
    if not project_name:
        project_name = docs_path.name.replace("-", " ").replace("_", " ").title()

    print(f"\n{'='*60}")
    print(f"  Docusaurus Frontmatter Injector")
    print(f"  Path: {docs_path}")
    print(f"  Project: {project_name}")
    print(f"  Dry run: {args.dry_run}")
    print(f"  Force: {args.force}")
    print(f"{'='*60}\n")

    # Find all .md and .mdx files
    files = sorted(
        list(docs_path.rglob("*.md")) + list(docs_path.rglob("*.mdx"))
    )

    if not files:
        print(f"No .md/.mdx files found in {docs_path}")
        sys.exit(0)

    print(f"Found {len(files)} files to process:\n")

    modified = 0
    for f in files:
        if process_file(f, project_name, args.dry_run, args.force):
            modified += 1

    print(f"\n{'='*60}")
    print(f"  Done: {modified}/{len(files)} files {'would be' if args.dry_run else ''} modified")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
