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
    monthly_rate = fields.Float()
    size = fields.Float()

    class Meta:
        model = StorageUnit
        include_fk = True
        load_instance = True


class BookingSchema(SQLAlchemyAutoSchema):
    total_cost = fields.Float()
    customer_name = fields.Str()
    customer_email = fields.Str() 
    customer_phone = fields.Str()
    unit = fields.Nested(StorageUnitSchema, only=['unit_id', 'unit_number', 'site', 'location'])

    class Meta:
        model = Booking
        include_fk = True
        load_instance = True
        exclude = [
            'user',
            'payment',
            'transport_requests'
        ]


class PaymentSchema(SQLAlchemyAutoSchema):
    amount = fields.Float()  

    class Meta:
        model = Payment
        include_fk = True
        load_instance = True


class TransportationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TransportationRequest
        include_fk = True
        load_instance = True


# ------------------------------------------------------
# INITIALIZE SCHEMAS
# ------------------------------------------------------
storage_schema = StorageUnitSchema()
storages_schema = StorageUnitSchema(many=True)
feature_schema = FeatureSchema()
features_schema = FeatureSchema(many=True)
booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)
payment_schema = PaymentSchema()
payments_schema = PaymentSchema(many=True)
transport_schema = TransportationSchema()
transports_schema = TransportationSchema(many=True)