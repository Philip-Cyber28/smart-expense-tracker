from datasets import load_dataset
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path

# PATHS
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "hf_model.pkl"
VECTORIZER_PATH = BASE_DIR / "hf_vectorizer.pkl"

dataset = load_dataset("mitulshah/transaction-categorization")

df = pd.DataFrame(dataset["train"])
df = df[["transaction_description", "category"]].rename(
    columns={"transaction_description": "text", "category": "category"}
)

X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["category"], test_size=0.2, random_state=42, stratify=df["category"]
)

vectorizer = TfidfVectorizer(stop_words="english", max_features=2000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

joblib.dump(model,MODEL_PATH)
joblib.dump(vectorizer,VECTORIZER_PATH)

print("Model Trained and Saved Successfully")