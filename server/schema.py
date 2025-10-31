from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate, ValidationError, pre_load, post_load
from datetime import date, datetime
from models import Customer, Feature, StorageUnit, Booking, Payment, TransportationRequest, Admin

ma = Marshmallow()

# Input validation schemas
class AdminLoginInputSchema(ma.Schema):
    username = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    password = fields.Str(required=True, validate=validate.Length(min=1))

class StorageUnitInputSchema(ma.Schema):
    unit_number = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    site = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    size = fields.Float(allow_none=True, validate=validate.Range(min=0))
    monthly_rate = fields.Float(required=True, validate=validate.Range(min=0))
    status = fields.Str(validate=validate.OneOf(['available', 'booked']), load_default='available')
    location = fields.Str(validate=validate.Length(max=100), allow_none=True)
    features = fields.List(fields.Str(), load_default=[])

class BookingInputSchema(ma.Schema):
    unit_id = fields.Int(required=True)
    customer_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    customer_email = fields.Email(required=True, validate=validate.Length(max=100))
    customer_phone = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    total_cost = fields.Float(required=True, validate=validate.Range(min=0))
    status = fields.Str(validate=validate.OneOf(['pending', 'paid', 'active', 'completed', 'cancelled']), load_default='pending')
    
    @post_load
    def validate_dates(self, data, **kwargs):
        if data['start_date'] >= data['end_date']:
            raise ValidationError('End date must be after start date')
        if data['start_date'] < date.today():
            raise ValidationError('Start date cannot be in the past')
        return data

class PaymentInputSchema(ma.Schema):
    booking_id = fields.Int(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    payment_method = fields.Str(validate=validate.Length(max=30), load_default='pending')
    status = fields.Str(validate=validate.OneOf(['pending', 'completed', 'failed']), load_default='pending')

class TransportationInputSchema(ma.Schema):
    booking_id = fields.Int(required=True)
    customer_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    pickup_address = fields.Str(required=True, validate=validate.Length(min=1, max=250))
    pickup_date = fields.Date(required=True)
    pickup_time = fields.Time(required=True)
    distance = fields.Float(validate=validate.Range(min=0), allow_none=True)
    special_instructions = fields.Str(validate=validate.Length(max=1000), load_default='')
    status = fields.Str(validate=validate.OneOf(['pending', 'scheduled', 'completed', 'cancelled']), load_default='pending')
    
    @post_load
    def validate_pickup_date(self, data, **kwargs):
        if data['pickup_date'] < date.today():
            raise ValidationError('Pickup date cannot be in the past')
        return data

class MpesaSTKInputSchema(ma.Schema):
    booking_id = fields.Int(required=True)
    phone_number = fields.Str(required=True, validate=validate.Length(min=10, max=15))
    amount = fields.Float(required=True, validate=validate.Range(min=1))

class MpesaQueryInputSchema(ma.Schema):
    checkout_request_id = fields.Str(required=True)

# Output schemas
class CustomerSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Customer
        load_instance = True

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
    customer = fields.Nested(CustomerSchema, only=['customer_id', 'name', 'email', 'phone'])
    customer_name = fields.Str()
    customer_email = fields.Str() 
    customer_phone = fields.Str()
    unit = fields.Nested(StorageUnitSchema, only=['unit_id', 'unit_number', 'site', 'location'])

    class Meta:
        model = Booking
        include_fk = True
        load_instance = True
        exclude = ['user', 'payment', 'transport_requests']

class PaymentSchema(SQLAlchemyAutoSchema):
    amount = fields.Float()  

    class Meta:
        model = Payment
        include_fk = True
        load_instance = True

class TransportationSchema(SQLAlchemyAutoSchema):
    customer = fields.Nested(CustomerSchema, only=['customer_id', 'name', 'phone'])
    
    class Meta:
        model = TransportationRequest
        include_fk = True
        load_instance = True


# ------------------------------------------------------
# INITIALIZE SCHEMAS
# ------------------------------------------------------
# Input validation schemas
admin_login_input_schema = AdminLoginInputSchema()
storage_unit_input_schema = StorageUnitInputSchema()
booking_input_schema = BookingInputSchema()
payment_input_schema = PaymentInputSchema()
transportation_input_schema = TransportationInputSchema()
mpesa_stk_input_schema = MpesaSTKInputSchema()
mpesa_query_input_schema = MpesaQueryInputSchema()

# Output schemas
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)
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
