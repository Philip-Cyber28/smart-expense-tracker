import pytesseract
from PIL import Image, ImageOps
import platform
import shutil

if platform.system() == 'Windows':
    # WINDOWS PATH
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
else:
    # LINUX/DOCKER
    tesseract_path = shutil.which('tesseract')
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
    else:
        pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

def run_ocr(image_path: str) -> str:
    img = Image.open(image_path)
    img = ImageOps.grayscale(img)
    text = pytesseract.image_to_string(img)
    return text