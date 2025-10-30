import random
from datetime import time, date, datetime
from faker import Faker
from app import app, db
from models import User, Admin, StorageUnit, Booking, Payment, TransportationRequest, Feature

fake = Faker()

def seed_data():
    with app.app_context():
        print("Seeding database...")

        db.session.query(Payment).delete()
        db.session.query(Booking).delete()
        db.session.query(TransportationRequest).delete()
        db.session.query(StorageUnit).delete()
        db.session.query(Feature).delete()
        db.session.query(User).delete()
        db.session.query(Admin).delete()

        admins = []

        # Create default admin
        admin = Admin(
            username='admin',
            email='admin@storage.com',
            role='admin'
        )
        admin.set_password('admin123')
        admins.append(admin)
        db.session.add(admin)
        print("Created admin user: username='admin', password='admin123'")
        
        # Create manager user
        manager = Admin(
            username='manager',
            email='manager@storage.com',
            role='manager'
        )
        manager.set_password('manager123')
        admins.append(manager)
        db.session.add(manager)
        print("Created manager user: username='manager', password='manager123'")
        
        # Create additional admin
        admin2 = Admin(
            username=fake.user_name(),
            email=fake.email(),
            role='admin'
        )
        admin2.set_password(fake.password(length=10))
        admins.append(admin2)
        db.session.add(admin2)

        # Create Users
        users = []
        for _ in range(8):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password_hash=fake.password(length=10)
            )
            users.append(user)
            db.session.add(user)

        # Create Features
        feature_names = ["24/7 Access", "Climate Control", "CCTV Security", "Drive-up Access", "Insurance Coverage"]
        features = [Feature(name=name) for name in feature_names]
        db.session.add_all(features)

        # Create Storage Units
        units = []
        size_options = [10, 15, 20, 25, 30]  # Common storage unit sizes in m²
        for i in range(10):
            unit = StorageUnit(
                unit_number=f"U-{100+i}",
                site=f"Site {random.randint(1,3)}",
                size=random.choice(size_options),
                location=fake.address(),
                monthly_rate=round(random.uniform(50, 300), 2),
                status=random.choice(["available", "booked"])
            )
            units.append(unit)
            db.session.add(unit)

        db.session.commit()  

        from models import UnitFeatureLink
        for unit in units:
            selected_features = random.sample(features, random.randint(1, 3))
            for feature in selected_features:
                existing = db.session.query(UnitFeatureLink).filter_by(
                    unit_id=unit.unit_id, 
                    feature_id=feature.feature_id
                ).first()
                if not existing:
                    link = UnitFeatureLink(unit_id=unit.unit_id, feature_id=feature.feature_id)
                    db.session.add(link)

        db.session.commit() 

        # Create Bookings
        bookings = []
        for _ in range(12):
            user = random.choice(users)
            unit = random.choice(units)
            booking = Booking(
                unit_id=unit.unit_id,
                customer_name=fake.name(),
                customer_email=fake.email(),
                customer_phone=fake.phone_number(),
                start_date=fake.date_this_year(),
                end_date=fake.date_between(start_date="+30d", end_date="+120d"),
                total_cost=round(unit.monthly_rate * random.randint(1, 6), 2),
                status=random.choice(["pending", "active", "completed"])
            )
            bookings.append(booking)
            db.session.add(booking)

        db.session.commit()
        # No seeded payments - only real payments will appear

        # Create Transportation Requests
        for _ in range(5):
            booking = random.choice(bookings)
            request = TransportationRequest(
                booking_id=booking.booking_id,
                customer_name=booking.customer_name,
                pickup_address=fake.address(),
                pickup_date=fake.date_this_year(),
                pickup_time=time(random.randint(8, 18), random.randint(0, 59)),
                distance=round(random.uniform(2, 30), 2),
                status=random.choice(["pending", "scheduled", "completed"])
            )
            db.session.add(request)

        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
