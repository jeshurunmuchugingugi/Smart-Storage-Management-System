import random
from datetime import time
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
            email='admin@storage.com'
        )
        admin.set_password('admin123')
        admins.append(admin)
        db.session.add(admin)
        
        # Create additional admin
        admin2 = Admin(
            username=fake.user_name(),
            email=fake.email()
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
        for i in range(10):
            unit = StorageUnit(
                unit_number=f"U-{100+i}",
                site=f"Site {random.randint(1,3)}",
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
                user_id=user.user_id,
                unit_id=unit.unit_id,
                start_date=fake.date_this_year(),
                end_date=fake.date_between(start_date="+30d", end_date="+120d"),
                total_cost=round(unit.monthly_rate * random.randint(1, 6), 2),
                status=random.choice(["pending", "active", "completed"])
            )
            bookings.append(booking)
            db.session.add(booking)

        db.session.commit()
        # Create Payment
        for booking in bookings:
            payment = Payment(
                booking_id=booking.booking_id,
                user_id=booking.user_id,
                amount=booking.total_cost,
                payment_method=random.choice(["card", "mobile_money", "paypal"]),
                status=random.choice(["pending", "completed", "failed"])
            )
            db.session.add(payment)

        # Create Transportation Requests
        for _ in range(5):
            user = random.choice(users)
            unit = random.choice(units)
            booking = random.choice(bookings)
            request = TransportationRequest(
                booking_id=booking.booking_id,
                user_id=user.user_id,
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
