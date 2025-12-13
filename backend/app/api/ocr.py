import shutil
from fastapi import APIRouter, UploadFile, File, Depends
from app.ml.ocr import run_ocr
from app.ml.classifier import predict_from_receipt
from app.services.dependencies import get_current_user

router = APIRouter(tags=["OCR"])

@router.post("/ocr")
def ocr_receipt(
    file : UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = run_ocr(file_path)

    categorized_items = predict_from_receipt(text)

    return{
        "ocr_text": text,
        "predicted_items": categorized_items
    }