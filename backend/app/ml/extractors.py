import re

def extract_total(ocr_text: str) -> float:
    """
    Extract total amount from OCR text.
    """
    match = re.search(r"total[:\s]*\$?(\d+\.?\d*)", ocr_text, re.IGNORECASE)
    if match:
        return float(match.group(1))

    match = re.search(r"amount[:\s]*\$?(\d+\.?\d*)", ocr_text, re.IGNORECASE)
    if match:
        return float(match.group(1))

    numbers = re.findall(r"\d+\.\d{2}", ocr_text)
    if numbers:
        return float(numbers[-1])

    return 0.0


def extract_date(ocr_text: str) -> str | None:
    """
    Extract date from OCR text in formats: YYYY-MM-DD or MM/DD/YYYY
    """
    match = re.search(r"date[:\s]*(\d{1,2}/\d{1,2}/\d{4})", ocr_text, re.IGNORECASE)
    if match:
        return match.group(1)

    match = re.search(r"(\d{4}-\d{2}-\d{2})", ocr_text)
    if match:
        return match.group(1)

    match = re.search(r"(\d{1,2}/\d{1,2}/\d{4})", ocr_text)
    if match:
        return match.group(1)

    return None
