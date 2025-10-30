from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add role column to user table using ORM
    with db.engine.connect() as conn:
        conn.execute(text("ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
        conn.commit()
    print("✅ Role column added to user table successfully")
