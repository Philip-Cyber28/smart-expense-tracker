import pytesseract
from PIL import Image, ImageOps

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def run_ocr(image_path: str) -> str:
    img = Image.open(image_path)
    img = ImageOps.grayscale(img)
    text = pytesseract.image_to_string(img)
    return text