# schema.py
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from models import Feature, StorageUnit, Booking, Payment, TransportationRequest

ma = Marshmallow()


class FeatureSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Feature
        load_instance = True


class StorageUnitSchema(SQLAlchemyAutoSchema):
    features = fields.Nested(FeatureSchema, many=True)

    class Meta:
        model = StorageUnit
        include_fk = True
        load_instance = True


class BookingSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        include_fk = True
        load_instance = True


class PaymentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        include_fk = True
        load_instance = True


class TransportationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TransportationRequest
        include_fk = True
        load_instance = True


storage_schema = StorageUnitSchema()
storages_schema = StorageUnitSchema(many=True)
feature_schema = FeatureSchema()
features_schema = FeatureSchema(many=True)
booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)