import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'instance', 'storage.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Check if approval_status column exists
    cursor.execute("PRAGMA table_info(booking)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'approval_status' not in columns:
        print("Adding approval_status column to booking table...")
        cursor.execute("""
            ALTER TABLE booking 
            ADD COLUMN approval_status TEXT DEFAULT 'pending_approval'
        """)
        conn.commit()
        print("✓ Column added successfully!")
    else:
        print("✓ approval_status column already exists")
    
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    conn.close()
