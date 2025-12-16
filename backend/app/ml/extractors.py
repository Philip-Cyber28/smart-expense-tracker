import re

def extract_total(ocr_text: str) -> float:

    lines = ocr_text.split('\n')

    for line in lines:
        line_lower = line.lower()
        if 'total' in line_lower and 'subtotal' not in line_lower:
            matches = re.findall(r"\$?\s*(\d+[.,]\d{2})", line)
            if matches:
                amount_str = matches[-1].replace(',', '.')
                return float(amount_str)
    
    for line in lines:
        if 'amount' in line.lower() and 'subtotal' not in line.lower():
            matches = re.findall(r"\$?\s*(\d+[.,]\d{2})", line)
            if matches:
                amount_str = matches[-1].replace(',', '.')
                return float(amount_str)
    numbers = re.findall(r"\d+[.,]\d{2}", ocr_text)
    if numbers:
        amounts = [float(n.replace(',', '.')) for n in numbers]
        return max(amounts)

    return 0.0


def extract_date(ocr_text: str) -> str | None:
    match = re.search(r"date[:\s]*(\d{4}-\d{2}-\d{2})", ocr_text, re.IGNORECASE)
    if match:
        return match.group(1)
    
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


def extract_title(ocr_text: str) -> str:
    lines = [line.strip() for line in ocr_text.split('\n') if line.strip()]
    
    if lines:
        for line in lines:
            if not re.match(r'^[\d\s\-:/]+$', line) and \
               not any(kw in line.lower() for kw in ['date', 'receipt', 'tax id', 'tel']):
                return line
    
    return "Receipt"