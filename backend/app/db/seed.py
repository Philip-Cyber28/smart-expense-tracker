import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy.orm import Session 
from app.models.models import Category
from app.db.database import  SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

categories = [ "Food & Groceries", "Transportation", "Utilities & Services", "Entertainment & Recreation", "Healthcare & Medical", "Shopping & Retail", "Other" ]

db = SessionLocal()

try:
    for cat in categories:
        exists = db.query(Category).filter(Category.name == cat).first()
        if not exists:
            db.add(Category(name=cat))
            print(f"Added category:{cat}")
        else:
            print(f"Category already exists: {cat}")

    db.commit()
    print("\nAll Categories seeded sucessfully")
except Exception as e:
    print(f"Error Seeding Database:{e}")
    db.rollback()

finally:
    db.close()