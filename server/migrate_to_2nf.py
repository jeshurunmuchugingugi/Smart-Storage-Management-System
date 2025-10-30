"""Migration script to convert database to 2NF"""
import sqlite3
import os
from datetime import datetime
from pathlib import Path

# Get the script's directory and construct absolute path to database
script_dir = Path(__file__).parent
db_path = script_dir / 'instance' / 'storage.db'

conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

print("Starting 2NF migration...")

# Create Customer table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS customer (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        national_id VARCHAR(50),
        address VARCHAR(250),
        city VARCHAR(100),
        postal_code VARCHAR(20),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

# Extract unique customers from bookings
cursor.execute('SELECT DISTINCT customer_name, customer_email, customer_phone FROM booking WHERE customer_name IS NOT NULL')
unique_customers = cursor.fetchall()

# Insert customers and map them
customer_map = {}
for name, email, phone in unique_customers:
    cursor.execute('INSERT INTO customer (name, email, phone, created_at) VALUES (?, ?, ?, ?)',
                   (name, email, phone, datetime.utcnow()))
    customer_map[(name, email, phone)] = cursor.lastrowid

# Add customer_id to booking
try:
    cursor.execute('ALTER TABLE booking ADD COLUMN customer_id INTEGER')
except sqlite3.OperationalError:
    pass

# Update bookings with customer_id
cursor.execute('SELECT booking_id, customer_name, customer_email, customer_phone FROM booking')
for booking_id, name, email, phone in cursor.fetchall():
    customer_id = customer_map.get((name, email, phone))
    if customer_id:
        cursor.execute('UPDATE booking SET customer_id = ? WHERE booking_id = ?', (customer_id, booking_id))

# Add customer_id to transportationrequest
try:
    cursor.execute('ALTER TABLE transportationrequest ADD COLUMN customer_id INTEGER')
except sqlite3.OperationalError:
    pass

# Update transport requests
cursor.execute('''
    UPDATE transportationrequest
    SET customer_id = (SELECT customer_id FROM booking WHERE booking.booking_id = transportationrequest.booking_id)
    WHERE booking_id IS NOT NULL
''')

# Create indexes
cursor.execute('CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_booking_customer ON booking(customer_id)')

conn.commit()
conn.close()

print("✓ Migration completed!")
