import random
from datetime import time
from faker import Faker
from app import app, db
from models import User, Admin, StorageUnit, Booking, Payment, TransportationRequest, Feature, UnitFeatureLink

fake = Faker()

def generate_mpesa_code():
    """Generate a realistic M-Pesa transaction code (10 alphanumeric characters)."""
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    digits = '0123456789'
    return ''.join(random.choice(letters + digits) for _ in range(10))

def seed_data():
    with app.app_context():
        print("Seeding database...")

        # ---------------------------
        # Clear all existing data
        # ---------------------------
        db.session.query(Payment).delete()
        db.session.query(TransportationRequest).delete()
        db.session.query(Booking).delete()
        db.session.query(UnitFeatureLink).delete()
        db.session.query(StorageUnit).delete()
        db.session.query(Feature).delete()
        db.session.query(User).delete()
        db.session.query(Admin).delete()

        # ---------------------------
        # Admin accounts
        # ---------------------------
        admin = Admin(username="admin", email="admin@storage.com", role="admin")
        admin.set_password("admin123")
        manager = Admin(username="manager", email="manager@storage.com", role="manager")
        manager.set_password("manager123")

        db.session.add_all([admin, manager])
        print("Created admins: admin/admin123 & manager/manager123")

        # ---------------------------
        # Users
        # ---------------------------
        users = []
        for _ in range(10):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password_hash=fake.password(length=10)
            )
            users.append(user)
        db.session.add_all(users)

        # ---------------------------
        # Features
        # ---------------------------
        feature_names = [
            "24/7 Access",
            "Climate Control",
            "CCTV Security",
            "Drive-up Access",
            "Insurance Coverage"
        ]
        features = [Feature(name=name) for name in feature_names]
        db.session.add_all(features)

        # ---------------------------
        # Storage Units
        # ---------------------------
        units = []
        size_options = [10, 15, 20, 25, 30]
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
        db.session.add_all(units)
        db.session.commit()

        # ---------------------------
        # Unit-Feature Links
        # ---------------------------
        for unit in units:
            selected_features = random.sample(features, random.randint(1, 3))
            for feature in selected_features:
                db.session.add(UnitFeatureLink(unit_id=unit.unit_id, feature_id=feature.feature_id))
        db.session.commit()

        # ---------------------------
        # Bookings
        # ---------------------------
        bookings = []
        for _ in range(15):
            user = random.choice(users)
            unit = random.choice(units)
            booking = Booking(
                unit_id=unit.unit_id,
                customer_name=fake.name(),
                customer_email=user.email,
                customer_phone=fake.phone_number(),
                start_date=fake.date_this_year(before_today=True, after_today=False),
                end_date=fake.date_between(start_date="+30d", end_date="+120d"),
                total_cost=round(unit.monthly_rate * random.randint(1, 6), 2),
                status=random.choice(["pending", "active", "completed", "paid"])
            )
            bookings.append(booking)
            db.session.add(booking)
        db.session.commit()

        # ---------------------------
        # Payments (M-Pesa only)
        # ---------------------------
        for booking in bookings:
            if booking.status in ["active", "completed", "paid"]:
                payment = Payment(
                    booking_id=booking.booking_id,
                    amount=booking.total_cost,
                    payment_method="M-Pesa",
                    status="completed",
                    transaction_id=generate_mpesa_code(),
                    payment_date=fake.date_time_this_year()
                )
                db.session.add(payment)
        db.session.commit()

        # ---------------------------
        # Transportation Requests
        # ---------------------------
        for _ in range(8):
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

        print(" Database seeded successfully with M-Pesa-only payments!")

if __name__ == "__main__":
    seed_data()
