"""Migration script to convert database to 2NF"""
from app import app, db
from models import Customer, Booking, TransportationRequest
from sqlalchemy import Column, Integer, ForeignKey, Index, inspect, Table, MetaData
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
    
    # Add customer_id columns using DDL
    inspector = inspect(db.engine)
    metadata = MetaData()
    
    booking_columns = [col['name'] for col in inspector.get_columns('booking')]
    if 'customer_id' not in booking_columns:
        booking_table = Table('booking', metadata, autoload_with=db.engine)
        customer_id_col = Column('customer_id', Integer, ForeignKey('customer.customer_id', ondelete='CASCADE'))
        with db.engine.begin() as conn:
            conn.execute(db.schema.AddColumn('booking', customer_id_col))
        print("✓ Added customer_id to booking table")
    
    transport_columns = [col['name'] for col in inspector.get_columns('transportationrequest')]
    if 'customer_id' not in transport_columns:
        transport_table = Table('transportationrequest', metadata, autoload_with=db.engine)
        customer_id_col = Column('customer_id', Integer, ForeignKey('customer.customer_id', ondelete='CASCADE'))
        with db.engine.begin() as conn:
            conn.execute(db.schema.AddColumn('transportationrequest', customer_id_col))
        print("✓ Added customer_id to transportationrequest table")
    
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
    
    # Create indexes using ORM
    existing_indexes = {idx['name'] for idx in inspector.get_indexes('customer')}
    if 'idx_customer_email' not in existing_indexes:
        idx = Index('idx_customer_email', Customer.email)
        idx.create(db.engine)
        print("✓ Created index on customer.email")
    
    booking_indexes = {idx['name'] for idx in inspector.get_indexes('booking')}
    if 'idx_booking_customer' not in booking_indexes:
        idx = Index('idx_booking_customer', Booking.customer_id)
        idx.create(db.engine)
        print("✓ Created index on booking.customer_id")
    
    print("✓ Migration completed!")
