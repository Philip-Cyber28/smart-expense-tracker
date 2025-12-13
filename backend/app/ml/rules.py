import re

RULES = [
    # Food
    (r"\b(restaurant|cafe|coffee|burger|pizza|food|dining)\b", "Food & Dining"),

    # Transportation
    (r"\b(uber|taxi|bus|train|metro|fuel|petrol|gas)\b", "Transportation"),

    # Entertainment
    (r"\b(cinema|movie|theatre|concert|netflix|spotify|game)\b", "Entertainment & Recreation"),

    # Healthcare
    (r"\b(hospital|clinic|pharmacy|medical|doctor|medicine)\b", "Healthcare & Medical"),

    # Utilities
    (r"\b(electric|water|internet|wifi|mobile|electricity|bill)\b", "Utilities & Services"),

    # Shopping
    (r"\b(mall|amazon|store|shop|retail)\b", "Shopping & Retail"),
]

def rule_based_prediction(text: str):
    text = text.lower()

    for pattern, category in RULES:
        if re.search(pattern, text):
            return category, 0.95

    return None
