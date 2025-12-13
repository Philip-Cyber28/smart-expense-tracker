import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL = joblib.load(BASE_DIR / "hf_model.pkl")
VECTORIZER = joblib.load(BASE_DIR / "hf_vectorizer.pkl")

def ml_predict(text: str):
    X = VECTORIZER.transform([text])
    pred = MODEL.predict(X)[0]
    prob = max(MODEL.predict_proba(X)[0])
    return pred, round(prob, 2)
