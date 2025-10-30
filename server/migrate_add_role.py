from app import app, db
from models import User
from sqlalchemy import text

with app.app_context():
    # Add role column to user table
    with db.engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
            conn.commit()
            print(" Role column added to user table successfully")
        except Exception as e:
            print(f"Column may already exist: {e}")
