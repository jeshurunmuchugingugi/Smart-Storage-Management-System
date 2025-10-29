"""
Clear all payment data from database
Only real payments made through the system will appear
"""
from app import app, db
from models import Payment

def clear_payments():
    with app.app_context():
        try:
            count = Payment.query.count()
            Payment.query.delete()
            db.session.commit()
            print(f"✓ Cleared {count} payment records from database")
            print("✓ Payment table is now empty")
            print("✓ Only real payments will appear from now on")
        except Exception as e:
            print(f"Error clearing payments: {str(e)}")
            db.session.rollback()

if __name__ == '__main__':
    clear_payments()
