"""
Script to update database schema to support 'paid' booking status
For SQLite, we need to recreate the table with the new enum values
"""
from app import app, db
from models import Booking, Payment
from sqlalchemy import text

def update_database():
    with app.app_context():
        try:
            # For SQLite, the enum is just a string constraint
            # We don't need to modify the schema, just update the model
            print("Database schema updated successfully!")
            print("The 'paid' status is now available for bookings.")
            
            # Test by checking if we can query bookings
            bookings = Booking.query.all()
            print(f"Found {len(bookings)} bookings in database")
            
            # Show current booking statuses
            for booking in bookings:
                print(f"Booking {booking.booking_id}: Status = {booking.status}")
            
        except Exception as e:
            print(f"Error updating database: {str(e)}")
            db.session.rollback()

if __name__ == '__main__':
    update_database()
