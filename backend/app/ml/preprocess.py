import re

def clean_text(ocr_text: str) -> str:
    lines = ocr_text.splitlines()
    lines = [
        line.strip()
        for line in lines
        if re.search(r"[A-Za-z]", line)
        and not re.search(r"(subtotal|total|tax|amount)", line, re.IGNORECASE)
    ]

    return " ".join(lines)
