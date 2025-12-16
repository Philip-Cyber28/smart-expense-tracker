from app.ml.rules import rule_based_prediction
from app.ml.preprocess import clean_text
from app.ml.predictor import ml_predict
from app.config.category_mapping import CATEGORY_MAPPING
from app.ml.extractors import extract_total, extract_date, extract_title


def predict_from_receipt(ocr_text: str):
    cleaned = clean_text(ocr_text)
    
    rule_result = rule_based_prediction(cleaned)
    if rule_result:
        raw_category, confidence = rule_result
    else:
        raw_category, confidence = ml_predict(cleaned)
        if confidence < 0.6:
            raw_category = "Other"
    
    final_category = CATEGORY_MAPPING.get(raw_category, "Other")

    total = extract_total(ocr_text)
    title = extract_title(ocr_text)
    date = extract_date(ocr_text)

    return [{
        "title": title,
        "amount": total,
        "category": final_category
    }]