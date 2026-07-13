#!/usr/bin/env python3
"""
PDF to Markdown Converter

Converts PDF files to Markdown format with support for:
- Text extraction with paragraph detection
- Table detection and formatting
- Heading detection (font size heuristic)
- Page separators
- Multiple PDF engines (pdfplumber, PyMuPDF, pdfminer)

Usage:
    python convert_pdf.py input.pdf -o output.md
    python convert_pdf.py input.pdf -o output.md --engine pymupdf
    python convert_pdf.py input.pdf -o output.md --no-tables --pages 1-5
"""

import argparse
import re
import sys
from pathlib import Path


def convert_with_pdfplumber(pdf_path: str, no_tables: bool = False,
                            no_headings: bool = False, pages: str = None) -> str:
    """Convert PDF using pdfplumber (best for tables)."""
    import pdfplumber

    md_lines = []
    with pdfplumber.open(pdf_path) as pdf:
        page_range = _parse_page_range(pages, len(pdf.pages))

        for i, page in enumerate(pdf.pages):
            if page_range and (i + 1) not in page_range:
                continue

            # Extract text
            text = page.extract_text()
            if text:
                # Detect and mark headings
                if not no_headings:
                    text = _detect_headings(text, page)
                md_lines.append(text)

            # Extract tables
            if not no_tables:
                tables = page.extract_tables()
                for table in tables:
                    if table and any(any(cell for cell in row) for row in table):
                        md_table = _table_to_markdown(table)
                        md_lines.append(f"\n{md_table}\n")

            md_lines.append(f"\n---\n*Page {page.page_number}*\n")

    return "\n\n".join(md_lines)


def convert_with_pymupdf(pdf_path: str, no_tables: bool = False,
                         no_headings: bool = False, pages: str = None) -> str:
    """Convert PDF using PyMuPDF (best for complex layouts)."""
    import fitz

    doc = fitz.open(pdf_path)
    md_lines = []
    page_range = _parse_page_range(pages, len(doc))

    for i, page in enumerate(doc):
        if page_range and (i + 1) not in page_range:
            continue

        # Try block-level text extraction first
        blocks = page.get_text("blocks")
        page_text = []
        for block in blocks:
            if block[6] == 0:  # text block
                text = block[4].strip()
                if text:
                    # Check font size for heading detection
                    font_size = _get_block_font_size(page, block)
                    if not no_headings and font_size and font_size > 12:
                        if font_size >= 18:
                            page_text.append(f"# {text}")
                        elif font_size >= 15:
                            page_text.append(f"## {text}")
                        elif font_size >= 13:
                            page_text.append(f"### {text}")
                        else:
                            page_text.append(text)
                    else:
                        page_text.append(text)

        if page_text:
            md_lines.append("\n\n".join(page_text))

        # Extract tables (PyMuPDF doesn't have native table detection,
        # but we can try to detect grid-like text patterns)
        if not no_tables:
            tables = page.find_tables()
            if tables:
                for table in tables:
                    data = table.extract()
                    if data:
                        md_table = _table_to_markdown(data)
                        md_lines.append(f"\n{md_table}\n")

        md_lines.append(f"\n---\n*Page {page.number + 1}*\n")

    doc.close()
    return "\n\n".join(md_lines)


def convert_with_pdfminer(pdf_path: str, pages: str = None) -> str:
    """Convert PDF using pdfminer.six (reliable fallback)."""
    from pdfminer.high_level import extract_text

    text = extract_text(pdf_path)
    return text


def _table_to_markdown(table: list) -> str:
    """Convert a table (list of lists) to Markdown table format."""
    if not table:
        return ""

    # Clean cells
    cleaned = []
    for row in table:
        cleaned.append([str(cell).strip().replace("\n", " ") if cell else "" for cell in row])

    # Ensure all rows have same column count
    max_cols = max(len(row) for row in cleaned)
    for row in cleaned:
        while len(row) < max_cols:
            row.append("")

    # Build markdown table
    lines = []
    # Header row
    header = cleaned[0]
    lines.append("| " + " | ".join(header) + " |")
    # Separator row
    lines.append("| " + " | ".join(["---"] * max_cols) + " |")
    # Data rows
    for row in cleaned[1:]:
        lines.append("| " + " | ".join(row) + " |")

    return "\n".join(lines)


def _detect_headings(text: str, page) -> str:
    """Heuristic heading detection based on font size in pdfplumber."""
    lines = text.split("\n")
    result = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            result.append(line)
            continue

        # Simple heuristic: short lines in ALL CAPS or ending without punctuation
        # could be headings. pdfplumber doesn't expose per-line font info easily,
        # so this is a lightweight approach.
        if len(stripped) < 80 and (
            stripped.isupper() or
            (not stripped[-1] in ".。,，;；" and len(stripped) < 40)
        ):
            # Check if it looks like a heading (no sentence structure)
            if not re.search(r'[.。,，;；:：]$', stripped):
                if len(stripped) < 30 and not re.search(r'\s{2,}', stripped):
                    result.append(f"## {stripped}")
                    continue

        result.append(line)
    return "\n".join(result)


def _get_block_font_size(page, block) -> float:
    """Get the font size of the first character in a block (PyMuPDF)."""
    try:
        bbox = block[:4]
        # Get text spans in the block area
        text_dict = page.get_text("dict", clip=bbox)
        for block_data in text_dict.get("blocks", []):
            for line in block_data.get("lines", []):
                for span in line.get("spans", []):
                    return span.get("size", 0)
    except Exception:
        pass
    return 0


def _parse_page_range(pages_str: str, total_pages: int) -> set:
    """Parse page range string like '1-5,8,10-12'."""
    if not pages_str:
        return set()

    result = set()
    parts = pages_str.split(",")
    for part in parts:
        part = part.strip()
        if "-" in part:
            try:
                start, end = part.split("-", 1)
                start, end = int(start), int(end)
                for p in range(start, end + 1):
                    if 1 <= p <= total_pages:
                        result.add(p)
            except ValueError:
                continue
        else:
            try:
                p = int(part)
                if 1 <= p <= total_pages:
                    result.add(p)
            except ValueError:
                continue
    return result


def main():
    parser = argparse.ArgumentParser(
        description="Convert PDF files to Markdown format"
    )
    parser.add_argument("input", help="Path to input PDF file")
    parser.add_argument("-o", "--output", default=None,
                        help="Output Markdown file path (default: input_name.md)")
    parser.add_argument("--engine", choices=["pdfplumber", "pymupdf", "pdfminer"],
                        default="pdfplumber",
                        help="PDF extraction engine (default: pdfplumber)")
    parser.add_argument("--no-tables", action="store_true",
                        help="Skip table extraction")
    parser.add_argument("--no-headings", action="store_true",
                        help="Skip heading detection")
    parser.add_argument("--pages", default=None,
                        help="Page range, e.g. '1-5' or '1,3,5-10'")

    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: File not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    if not input_path.suffix.lower() == ".pdf":
        print(f"Error: Not a PDF file: {args.input}", file=sys.stderr)
        sys.exit(1)

    output_path = args.output or input_path.with_suffix(".md")

    print(f"Converting: {input_path}")
    print(f"Engine: {args.engine}")
    print(f"Output: {output_path}")

    try:
        if args.engine == "pdfplumber":
            md_content = convert_with_pdfplumber(
                str(input_path), args.no_tables, args.no_headings, args.pages
            )
        elif args.engine == "pymupdf":
            md_content = convert_with_pymupdf(
                str(input_path), args.no_tables, args.no_headings, args.pages
            )
        elif args.engine == "pdfminer":
            md_content = convert_with_pdfminer(str(input_path), args.pages)
        else:
            print(f"Error: Unknown engine: {args.engine}", file=sys.stderr)
            sys.exit(1)
    except ImportError as e:
        print(f"Error: Required library not installed: {e}", file=sys.stderr)
        print(f"Install with: pip install {args.engine}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during conversion: {e}", file=sys.stderr)
        sys.exit(1)

    if not md_content or not md_content.strip():
        print("Warning: No text content extracted from PDF.", file=sys.stderr)
        md_content = "*No extractable text content found in this PDF.*\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    print(f"Done! Output written to: {output_path}")


if __name__ == "__main__":
    main()
