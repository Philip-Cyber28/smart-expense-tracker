import shutil
import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.ml.ocr import run_ocr
from app.ml.classifier import predict_from_receipt
from app.services.dependencies import get_current_user

router = APIRouter(tags=["OCR"])

@router.post("/ocr")
def ocr_receipt(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
):

    try:
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        text = run_ocr(file_path)

        categorized_items = predict_from_receipt(text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")
    
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    return {
        "ocr_text": text,
        "predicted_items": categorized_items
    }
