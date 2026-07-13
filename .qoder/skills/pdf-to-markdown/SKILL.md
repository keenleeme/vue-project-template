---
name: pdf-to-markdown
description: Extract text, tables, and structure from PDF files and convert them to well-formatted Markdown documents. Use when the user asks to convert PDF files to MD, extract PDF content, or transform PDFs into readable markdown format.
---

# PDF to Markdown Conversion

Convert PDF files into clean, structured Markdown documents preserving text, tables, and document hierarchy.

## Quick Start

1. Run the conversion script on the target PDF:
   ```bash
   python scripts/convert_pdf.py "path/to/input.pdf" -o "path/to/output.md"
   ```

2. For complex PDFs (multi-column, scanned), use PyMuPDF mode:
   ```bash
   python scripts/convert_pdf.py "input.pdf" -o "output.md" --engine pymupdf
   ```

3. Review the output MD file and manually correct any formatting issues.

## Library Selection Guide

| Scenario | Library | Reason |
|----------|---------|--------|
| Text + tables (default) | **pdfplumber** | Best table extraction, clean text |
| Complex layout / OCR needed | **PyMuPDF (fitz)** | Better layout analysis, image extraction |
| Fallback / simple text | **pdfminer.six** | Reliable text extraction |

## Pre-installed Libraries

- `pdfplumber` (0.11.9) — Primary choice, excellent table handling
- `PyMuPDF` (1.27.2.3) — Complex layouts, images, OCR-ready
- `pdfminer.six` — Reliable fallback for text extraction
- `pypdfium2` — Alternative PDF renderer

## Conversion Script

The script `scripts/convert_pdf.py` handles:
- Text extraction with paragraph detection
- Table detection and Markdown table formatting
- Heading detection based on font size/weight
- Page separation markers
- Image placeholder insertion

### Script Options

```
usage: convert_pdf.py input.pdf [-o OUTPUT.md] [--engine {pdfplumber,pymupdf,pdfminer}]
                                [--no-tables] [--no-headings] [--pages RANGE]
```

### Manual Conversion (Without Script)

If the script cannot be used, convert manually:

**Using pdfplumber:**
```python
import pdfplumber

with pdfplumber.open("input.pdf") as pdf:
    md_lines = []
    for page in pdf.pages:
        # Extract text
        text = page.extract_text()
        if text:
            md_lines.append(text)
        # Extract tables
        tables = page.extract_tables()
        for table in tables:
            md_lines.append(table_to_markdown(table))
        md_lines.append(f"\n---\n*Page {page.page_number}*\n")

    with open("output.md", "w", encoding="utf-8") as f:
        f.write("\n\n".join(md_lines))
```

**Using PyMuPDF:**
```python
import fitz

doc = fitz.open("input.pdf")
md_lines = []
for page in doc:
    text = page.get_text("text")
    if text:
        md_lines.append(text)
    md_lines.append(f"\n---\n*Page {page.number + 1}*\n")

with open("output.md", "w", encoding="utf-8") as f:
    f.write("\n\n".join(md_lines))
```

## Post-Conversion Checklist

After conversion, always:
- [ ] Verify heading hierarchy (H1 > H2 > H3)
- [ ] Check table formatting renders correctly
- [ ] Remove excessive blank lines / page separators if not needed
- [ ] Fix any garbled CJK characters
- [ ] Add missing image references if needed
- [ ] Ensure code blocks are properly fenced

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Chinese text garbled | Ensure UTF-8 encoding; use PyMuPDF for better CJK support |
| Tables not detected | Try `--engine pdfplumber` (best table detection) |
| Scanned/image PDF | Requires OCR — notify user, not directly extractable |
| Multi-column layout chaos | Use `--engine pymupdf` for layout-aware extraction |
| Missing headings | Manually add `#` headings based on context |
