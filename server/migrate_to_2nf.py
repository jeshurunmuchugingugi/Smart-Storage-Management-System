"""Migration script to convert database to 2NF"""
from app import app, db
from models import Customer, Booking, TransportationRequest
from sqlalchemy import text, Index
from datetime import datetime

with app.app_context():
    print("Starting 2NF migration...")
    
    # Create Customer table if not exists
    db.create_all()
    
    # Extract unique customers from bookings
    bookings = db.session.query(Booking.customer_name, Booking.customer_email, Booking.customer_phone).filter(
        Booking.customer_name.isnot(None)
    ).distinct().all()
    
    # Insert customers and map them
    customer_map = {}
    for name, email, phone in bookings:
        customer = Customer(name=name, email=email, phone=phone, created_at=datetime.utcnow())
        db.session.add(customer)
        db.session.flush()
        customer_map[(name, email, phone)] = customer.customer_id
    
    db.session.commit()
    
    # Add customer_id columns if not exist
    with db.engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE booking ADD COLUMN customer_id INTEGER"))
            conn.commit()
        except Exception:
            pass
        
        try:
            conn.execute(text("ALTER TABLE transportationrequest ADD COLUMN customer_id INTEGER"))
            conn.commit()
        except Exception:
            pass
    
    # Update bookings with customer_id
    all_bookings = Booking.query.all()
    for booking in all_bookings:
        if booking.customer_name:
            customer_id = customer_map.get((booking.customer_name, booking.customer_email, booking.customer_phone))
            if customer_id:
                booking.customer_id = customer_id
    
    db.session.commit()
    
    # Update transport requests
    transport_requests = TransportationRequest.query.filter(TransportationRequest.booking_id.isnot(None)).all()
    for tr in transport_requests:
        if tr.booking:
            tr.customer_id = tr.booking.customer_id
    
    db.session.commit()
    
    # Create indexes
    with db.engine.connect() as conn:
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_booking_customer ON booking(customer_id)"))
        conn.commit()
    
    print("✓ Migration completed!")
