from datetime import datetime, date
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import Enum
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

booking_status_enum = Enum("pending", "paid", "active", "completed", "cancelled", name="booking_status")
approval_status_enum = Enum("pending_approval", "approved", "rejected", name="approval_status")
payment_status_enum = Enum("pending", "completed", "failed", name="payment_status")
transport_status_enum = Enum("pending", "scheduled", "completed", "cancelled", name="transport_status")
unit_status_enum = Enum("available", "booked", name="unit_status")


class User(db.Model):
    __tablename__ = "user"

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(20))
    registration_date = db.Column(db.Date, default=date.today)
    password_hash = db.Column(db.String(200), nullable=False)

    bookings = db.relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    payments = db.relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    transport_requests = db.relationship("TransportationRequest", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password):
        if not password:
            raise ValueError("Password cannot be empty")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not password or not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


class Admin(db.Model):
    __tablename__ = "admin"

    admin_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="manager")

    def set_password(self, password):
        if not password:
            raise ValueError("Password cannot be empty")
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not password or not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Admin {self.username}>"


class Feature(db.Model):
    __tablename__ = "feature"

    feature_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    _unit_links = db.relationship("UnitFeatureLink", back_populates="_feature", cascade="all, delete-orphan")

    units = association_proxy("_unit_links", "_unit",
                              creator=lambda unit: UnitFeatureLink(_unit=unit))

    def __repr__(self):
        return f"<Feature {self.name}>"


class UnitFeatureLink(db.Model):
    __tablename__ = "unit_feature_link"

    unit_id = db.Column(db.Integer, db.ForeignKey("storageunit.unit_id", ondelete="CASCADE"), primary_key=True)
    feature_id = db.Column(db.Integer, db.ForeignKey("feature.feature_id", ondelete="CASCADE"), primary_key=True)

    _unit = db.relationship("StorageUnit", back_populates="_feature_links")
    _feature = db.relationship("Feature", back_populates="_unit_links")


class StorageUnit(db.Model):
    __tablename__ = "storageunit"

    unit_id = db.Column(db.Integer, primary_key=True)
    unit_number = db.Column(db.String(20), nullable=False)
    site = db.Column(db.String(50), nullable=False)
    size = db.Column(db.Numeric(5, 2), nullable=True)  # Size in square meters
    monthly_rate = db.Column(db.Numeric(8, 2), nullable=False)
    status = db.Column(unit_status_enum, default="available", nullable=False)
    location = db.Column(db.String(100))

    bookings = db.relationship("Booking", back_populates="unit", cascade="all, delete-orphan")

    _feature_links = db.relationship("UnitFeatureLink", back_populates="_unit", cascade="all, delete-orphan")

    features = association_proxy("_feature_links", "_feature",
                                 creator=lambda feature: UnitFeatureLink(_feature=feature))

    # amazonq-ignore-next-line
    def __repr__(self):
        return f"<StorageUnit {self.unit_number} ({self.status})>"


class Booking(db.Model):
    __tablename__ = "booking"

    booking_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id", ondelete="CASCADE"), nullable=True)
    unit_id = db.Column(db.Integer, db.ForeignKey("storageunit.unit_id", ondelete="CASCADE"))
    # Customer details
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    # Booking details
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(booking_status_enum, default="pending", nullable=False)
    approval_status = db.Column(approval_status_enum, default="pending_approval", nullable=False)
    total_cost = db.Column(db.Numeric(8, 2), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="bookings")
    unit = db.relationship("StorageUnit", back_populates="bookings")
    payment = db.relationship("Payment", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    transport_requests = db.relationship("TransportationRequest", back_populates="booking", cascade="all, delete-orphan")

    def validate_dates(self):
        try:
            if not self.start_date or not self.end_date:
                raise ValueError("Start date and end date are required")
            if self.start_date >= self.end_date:
                raise ValueError("End date must be after start date")
            if self.start_date < date.today():
                raise ValueError("Start date cannot be in the past")
        except (TypeError, AttributeError) as e:
            raise ValueError(f"Invalid date format: {str(e)}")

    def __repr__(self):
        return f"<Booking {self.booking_id} - {self.status}>"


class Payment(db.Model):
    __tablename__ = "payment"

    payment_id = db.Column(db.Integer, primary_key=True)
    # amazonq-ignore-next-line
    booking_id = db.Column(db.Integer, db.ForeignKey("booking.booking_id", ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id", ondelete="CASCADE"), nullable=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(30))
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(payment_status_enum, default="pending")
    transaction_id = db.Column(db.String(200))
    # M-Pesa specific fields
    mpesa_receipt_number = db.Column(db.String(100))
    checkout_request_id = db.Column(db.String(100))
    merchant_request_id = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))

    booking = db.relationship("Booking", back_populates="payment")
    user = db.relationship("User", back_populates="payments")

    def __repr__(self):
        return f"<Payment {self.payment_id} - {self.status}>"
    
    def update_from_mpesa_callback(self, callback_data):
        """Update payment from M-Pesa callback data"""
        self.mpesa_receipt_number = callback_data.get('mpesa_receipt_number')
        self.transaction_id = callback_data.get('transaction_id')
        self.status = 'completed' if callback_data.get('result_code') == 0 else 'failed'


class TransportationRequest(db.Model):
    __tablename__ = "transportationrequest"

    request_id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("booking.booking_id", ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id", ondelete="CASCADE"), nullable=True)
    customer_name = db.Column(db.String(100), nullable=False)
    pickup_address = db.Column(db.String(250), nullable=False)
    pickup_date = db.Column(db.Date, nullable=False)
    pickup_time = db.Column(db.Time, nullable=False)
    distance = db.Column(db.Numeric(8, 2))
    status = db.Column(transport_status_enum, default="pending")
    special_instructions = db.Column(db.Text)

    booking = db.relationship("Booking", back_populates="transport_requests")
    user = db.relationship("User", back_populates="transport_requests")

    def validate_pickup_details(self):
        try:
            if not self.pickup_date or not self.pickup_time:
                raise ValueError("Pickup date and time are required")
            if self.pickup_date < date.today():
                raise ValueError("Pickup date cannot be in the past")
        except (TypeError, AttributeError) as e:
            raise ValueError(f"Invalid date/time format: {str(e)}")

    def __repr__(self):
        return f"<TransportRequest {self.request_id} - {self.status}>"

