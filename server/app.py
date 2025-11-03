from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Api, Resource
from models import db, User, Admin, Customer, StorageUnit, Booking, Feature, Payment, TransportationRequest
from config import Config
from schema import (validate_admin_login, validate_storage_unit, validate_booking,
                   validate_payment, validate_transportation, validate_mpesa_stk,
                   validate_mpesa_query)
from datetime import datetime, date
import logging
import uuid
import os
from mpesa_service import MpesaService
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS properly
allowed_origins = os.getenv('CORS_ORIGINS', 'https://smart-storage-management-system-46b.vercel.app').split(',')
CORS(app, 
     origins=allowed_origins,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
     supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)


# Role-based access control decorator
def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            admin_id = get_jwt_identity()
            admin = Admin.query.get(admin_id)
            if not admin or admin.role not in allowed_roles:
                return {'error': 'Access denied. Insufficient permissions.'}, 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

class AdminLoginResource(Resource):
    def post(self):
        try:
            json_data = request.get_json()
            if not json_data:
                return {'error': 'No data provided'}, 400
            
            # Validate input
            data = validate_admin_login(json_data)
            
            admin = Admin.query.filter_by(username=data['username']).first()

            if admin and admin.check_password(data['password']):
                access_token = create_access_token(
                    identity=str(admin.admin_id),
                    additional_claims={'role': admin.role}
                )
                return {
                    'access_token': access_token,
                    'admin': {
                        'id': admin.admin_id,
                        'username': admin.username,
                        'role': admin.role
                    }
                }, 200

            return {'error': 'Invalid credentials'}, 401
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            logging.error(f"Error during admin login: {str(e)}")
            return {'error': 'Login failed'}, 500

class StorageUnitListResource(Resource):
    def get(self):
        try:
            units = StorageUnit.query.all()
            return [unit.to_dict() for unit in units], 200
        except Exception as e:
            logging.error(f"Error fetching storage units: {str(e)}")
            return {'error': 'Failed to fetch storage units'}, 500

    @role_required(['admin'])
    def post(self):
        try:
            logging.info("POST /api/units - Creating new storage unit")
            json_data = request.get_json()
            logging.info(f"Received data: {json_data}")
            
            if not json_data:
                return {'error': 'No data provided'}, 400

            # Validate input
            data = validate_storage_unit(json_data)
            
            unit = StorageUnit(
                unit_number=data['unit_number'],
                site=data['site'],
                size=data.get('size'),
                monthly_rate=data['monthly_rate'],
                status=data['status'],
                location=data.get('location')
            )

            for feature_name in data['features']:
                feature = Feature.query.filter_by(name=feature_name).first()
                if not feature:
                    feature = Feature(name=feature_name)
                unit.features.append(feature)

            db.session.add(unit)
            db.session.commit()
            logging.info(f"Successfully created unit: {unit.unit_id}")
            return unit.to_dict(), 201
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating storage unit: {str(e)}")
            logging.exception("Full traceback:")
            return {'error': f'Failed to create storage unit: {str(e)}'}, 500


class StorageUnitResource(Resource):
    def get(self, unit_id):
        try:
            unit = StorageUnit.query.get_or_404(unit_id)
            return unit.to_dict(), 200
        except Exception as e:
            logging.error(f"Error fetching storage unit {unit_id}: {str(e)}")
            return {'error': 'Storage unit not found'}, 404

    @role_required(['admin'])
    def put(self, unit_id):
        try:
            unit = StorageUnit.query.get_or_404(unit_id)
            json_data = request.get_json()
            if not json_data:
                return {'error': 'No data provided'}, 400

            # Validate input (partial update)
            data = validate_storage_unit(json_data, partial=True)
            
            # Update fields
            for field in ['unit_number', 'site', 'size', 'monthly_rate', 'status', 'location']:
                if field in data:
                    setattr(unit, field, data[field])

            if 'features' in data:
                unit.features.clear()
                for feature_name in data['features']:
                    feature = Feature.query.filter_by(name=feature_name).first()
                    if not feature:
                        feature = Feature(name=feature_name)
                    unit.features.append(feature)

            db.session.commit()
            return unit.to_dict(), 200
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating storage unit {unit_id}: {str(e)}")
            return {'error': 'Failed to update storage unit'}, 500

    @role_required(['admin'])
    def delete(self, unit_id):
        try:
            unit = StorageUnit.query.get_or_404(unit_id)
            db.session.delete(unit)
            db.session.commit()
            return {"message": "Storage unit deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting storage unit {unit_id}: {str(e)}")
            return {'error': 'Failed to delete storage unit'}, 500


class FeatureListResource(Resource):
    def get(self):
        try:
            features = Feature.query.all()
            return [feature.to_dict() for feature in features], 200
        except Exception as e:
            logging.error(f"Error fetching features: {str(e)}")
            return {'error': 'Failed to fetch features'}, 500

    def post(self):
        try:
            data = request.get_json()
            if not data or 'name' not in data:
                return {'error': 'Feature name is required'}, 400
            
            feature = Feature(name=data['name'])
            db.session.add(feature)
            db.session.commit()
            return feature.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating feature: {str(e)}")
            return {'error': 'Failed to create feature'}, 500


class BookingListResource(Resource):
    @jwt_required(optional=True)
    def get(self):
        try:
            bookings = Booking.query.all()
            return [booking.to_dict() for booking in bookings], 200
        except Exception as e:
            logging.error(f"Error fetching bookings: {str(e)}")
            return {'error': 'Failed to fetch bookings'}, 500

    def post(self):
        try:
            json_data = request.get_json()
            if not json_data:
                return {'error': 'No data provided'}, 400

            # Validate input
            data = validate_booking(json_data)

            # Check if unit exists and is available
            unit = StorageUnit.query.get(data['unit_id'])
            if not unit:
                return {'error': 'Storage unit not found'}, 404
            if unit.status != 'available':
                return {'error': 'Storage unit is not available'}, 400

            # Create or find customer
            customer = Customer.query.filter_by(email=data['customer_email']).first()
            if not customer:
                customer = Customer(
                    name=data['customer_name'].strip(),
                    email=data['customer_email'].strip(),
                    phone=data['customer_phone'].strip()
                )
                db.session.add(customer)
                db.session.flush()  # Get customer_id

            booking = Booking(
                unit_id=data['unit_id'],
                customer_id=customer.customer_id,
                customer_name=data['customer_name'].strip(),
                customer_email=data['customer_email'].strip(),
                customer_phone=data['customer_phone'].strip(),
                start_date=data['start_date'],
                end_date=data['end_date'],
                total_cost=data['total_cost'],
                status=data['status']
            )

            # Update unit status to booked
            unit.status = 'booked'

            db.session.add(booking)
            db.session.add(unit)
            db.session.flush()  # Get the booking_id before commit

            result = {
                'booking_id': booking.booking_id,
                'unit_id': booking.unit_id,
                'customer_id': customer.customer_id,
                'customer_name': booking.customer_name,
                'customer_email': booking.customer_email,
                'customer_phone': booking.customer_phone,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'total_cost': float(booking.total_cost),
                'status': booking.status,
                'booking_date': booking.booking_date.isoformat()
            }

            db.session.commit()

            return result, 201
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': str(e)}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating booking: {str(e)}")
            return {'error': f'Failed to create booking: {str(e)}'}, 500


class BookingResource(Resource):
    def get(self, booking_id):
        try:
            booking = Booking.query.get_or_404(booking_id)
            return booking.to_dict(), 200
        except Exception as e:
            logging.error(f"Error fetching booking {booking_id}: {str(e)}")
            return {'error': 'Booking not found'}, 404


class PaymentListResource(Resource):
    def get(self):
        try:
            payments = Payment.query.all()
            return [payment.to_dict() for payment in payments], 200
        except Exception as e:
            logging.error(f"Error fetching payments: {str(e)}")
            return {'error': 'Failed to fetch payments'}, 500

    def post(self):
        try:
            json_data = request.get_json(force=True)
            if not json_data:
                return {'error': 'No data provided'}, 400
            
            # Validate input
            data = validate_payment(json_data)
            
            # Check if booking exists
            booking = Booking.query.get(data['booking_id'])
            if not booking:
                return {'error': 'Booking not found'}, 404
            
            payment = Payment(
                booking_id=data['booking_id'],
                amount=data['amount'],
                payment_method=data['payment_method'],
                status=data['status']
            )
            
            # Update booking status to 'paid' when payment is completed
            if data['status'] == 'completed':
                booking.status = 'paid'
            
            db.session.add(payment)
            db.session.commit()
            return payment.to_dict(), 201
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating payment: {str(e)}")
            return {'error': 'Failed to create payment'}, 500


class TransportationResource(Resource):
    def post(self):
        try:
            json_data = request.get_json()
            if not json_data:
                return {'error': 'No data provided'}, 400
            
            # Validate input
            data = validate_transportation(json_data)
            
            transport = TransportationRequest(
                booking_id=data['booking_id'],
                customer_name=data['customer_name'].strip(),
                pickup_address=data['pickup_address'].strip(),
                pickup_date=data['pickup_date'],
                pickup_time=data['pickup_time'],
                distance=data.get('distance'),
                special_instructions=data['special_instructions'].strip(),
                status=data['status']
            )
            db.session.add(transport)
            db.session.commit()
            return {'message': 'Transportation request created', 'request_id': transport.request_id}, 201
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating transportation request: {str(e)}")
            return {'error': f'Failed to create transportation request: {str(e)}'}, 500


class MpesaSTKPushResource(Resource):
    def post(self):
        """Initiate M-Pesa STK Push payment"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {'error': 'No data provided'}, 400
            
            # Validate input
            data = validate_mpesa_stk(json_data)
            
            # Validate booking exists
            booking = Booking.query.get(data['booking_id'])
            if not booking:
                return {'error': 'Booking not found'}, 404
            
            # Format phone number (remove + and spaces, ensure starts with 254)
            phone = data['phone_number'].replace('+', '').replace(' ', '')
            if phone.startswith('0'):
                phone = '254' + phone[1:]
            elif not phone.startswith('254'):
                phone = '254' + phone
            
            # Initialize M-Pesa service
            mpesa = MpesaService()
            
            # Initiate STK Push
            result = mpesa.stk_push(
                phone_number=phone,
                amount=data['amount'],
                account_reference=f"BOOKING-{data['booking_id']}",
                transaction_desc=f"Storage Unit Payment"
            )
            
            if result.get('success'):
                # Create or update payment record
                payment = Payment.query.filter_by(booking_id=data['booking_id']).first()
                if not payment:
                    payment = Payment(
                        booking_id=data['booking_id'],
                        amount=data['amount'],
                        payment_method='mpesa',
                        status='pending'
                    )
                    db.session.add(payment)
                
                payment.checkout_request_id = result.get('checkout_request_id')
                payment.merchant_request_id = result.get('merchant_request_id')
                payment.phone_number = phone
                
                db.session.commit()
                
                return {
                    'success': True,
                    'message': result.get('message'),
                    'checkout_request_id': result.get('checkout_request_id')
                }, 200
            else:
                return {'error': result.get('error')}, 400
                
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error initiating M-Pesa payment: {str(e)}")
            return {'error': f'Failed to initiate payment: {str(e)}'}, 500


class MpesaCallbackResource(Resource):
    def post(self):
        """Handle M-Pesa payment callback"""
        try:
            data = request.get_json()
            logging.info(f"M-Pesa Callback received: {data}")
            
            # Extract callback data
            body = data.get('Body', {}).get('stkCallback', {})
            result_code = body.get('ResultCode')
            checkout_request_id = body.get('CheckoutRequestID')
            
            # Find payment by checkout_request_id
            payment = Payment.query.filter_by(checkout_request_id=checkout_request_id).first()
            
            if payment:
                if result_code == 0:
                    # Payment successful
                    callback_metadata = body.get('CallbackMetadata', {}).get('Item', [])
                    mpesa_receipt = next((item['Value'] for item in callback_metadata if item['Name'] == 'MpesaReceiptNumber'), None)
                    
                    payment.status = 'completed'
                    payment.mpesa_receipt_number = mpesa_receipt
                    payment.transaction_id = mpesa_receipt
                    
                    # Update booking status to 'paid' when payment is confirmed
                    booking = Booking.query.get(payment.booking_id)
                    if booking:
                        booking.status = 'paid'
                else:
                    # Payment failed
                    payment.status = 'failed'
                
                db.session.commit()
                logging.info(f"Payment updated: {payment.payment_id} - Status: {payment.status}")
            
            return {'ResultCode': 0, 'ResultDesc': 'Success'}, 200
            
        except Exception as e:
            logging.error(f"Error processing M-Pesa callback: {str(e)}")
            return {'ResultCode': 1, 'ResultDesc': 'Failed'}, 500


class MpesaQueryResource(Resource):
    def post(self):
        """Query M-Pesa payment status"""
        try:
            json_data = request.get_json()
            if not json_data:
                return {'error': 'No data provided'}, 400

            # Validate input
            data = validate_mpesa_query(json_data)

            mpesa = MpesaService()
            result = mpesa.query_stk_status(data['checkout_request_id'])

            return result, 200
        except ValidationError as e:
            return {'error': 'Validation failed', 'messages': e.messages}, 400
        except Exception as e:
            logging.error(f"Error querying M-Pesa status: {str(e)}")
            return {'error': str(e)}, 500


class CustomerListResource(Resource):
    @role_required(['admin'])
    def get(self):
        try:
            customers = Customer.query.all()
            return [customer.to_dict() for customer in customers], 200
        except Exception as e:
            logging.error(f"Error fetching customers: {str(e)}")
            return {'error': 'Failed to fetch customers'}, 500


class CustomerResource(Resource):
    @role_required(['admin'])
    def get(self, customer_id):
        try:
            customer = Customer.query.get_or_404(customer_id)
            customer_data = customer.to_dict()

            # Add booking and payment summary
            active_bookings = [b for b in customer.bookings if b.status in ['pending', 'paid', 'active']]
            completed_bookings = [b for b in customer.bookings if b.status == 'completed']

            customer_data['active_bookings_count'] = len(active_bookings)
            customer_data['completed_bookings_count'] = len(completed_bookings)
            customer_data['total_bookings'] = len(customer.bookings)

            return customer_data, 200
        except Exception as e:
            logging.error(f"Error fetching customer {customer_id}: {str(e)}")
            return {'error': 'Customer not found'}, 404

    @role_required(['admin'])
    def delete(self, customer_id):
        try:
            customer = Customer.query.get_or_404(customer_id)

            # Check if customer has active bookings
            active_bookings = [b for b in customer.bookings if b.status in ['pending', 'paid', 'active']]
            if active_bookings:
                return {'error': 'Cannot delete customer with active bookings. Customer must vacate all units first.'}, 400

            # Check if customer has unpaid payments
            unpaid_payments = []
            for booking in customer.bookings:
                if booking.payment and booking.payment.status != 'completed':
                    unpaid_payments.append(booking.payment)

            if unpaid_payments:
                return {'error': 'Cannot delete customer with outstanding payments. All payments must be settled.'}, 400

            # Safe to delete - all bookings completed and payments settled
            db.session.delete(customer)
            db.session.commit()

            return {'message': 'Customer deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting customer {customer_id}: {str(e)}")
            return {'error': 'Failed to delete customer'}, 500


api.add_resource(AdminLoginResource, '/api/admin/login')
api.add_resource(StorageUnitListResource, '/api/units')
api.add_resource(StorageUnitResource, '/api/units/<int:unit_id>')
api.add_resource(FeatureListResource, '/api/features')
api.add_resource(BookingListResource, '/api/bookings')
api.add_resource(BookingResource, '/api/bookings/<int:booking_id>')
api.add_resource(PaymentListResource, '/api/payments')
api.add_resource(TransportationResource, '/api/transportation')
api.add_resource(MpesaSTKPushResource, '/api/mpesa/stkpush')
api.add_resource(MpesaCallbackResource, '/api/mpesa/callback')
api.add_resource(MpesaQueryResource, '/api/mpesa/query')
api.add_resource(CustomerListResource, '/api/customers')
api.add_resource(CustomerResource, '/api/customers/<int:customer_id>')

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        origin = request.origin
        if origin and origin in allowed_origins:
            response.headers.add("Access-Control-Allow-Origin", origin)
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization,X-CSRF-Token")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response

@app.route('/api/csrf-token', methods=['GET'])
def get_csrf_token():
    """Generate a simple CSRF token for form submissions"""
    token = str(uuid.uuid4())
    response = jsonify({'csrfToken': token})
    origin = request.origin
    if origin and origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, 200

@app.route('/')
def home():
    return jsonify({
        "message": "Smart Storage Management System API",
        "status": "running",
        "endpoints": {
            "admin_login": "/api/admin/login",
            "units": "/api/units",
            "features": "/api/features",
            "bookings": "/api/bookings"
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    try:
        with app.app_context():
            db.create_all()
            print("Database initialized successfully")
        
        port = int(os.getenv('PORT', 5001))
        host = os.getenv('HOST', '0.0.0.0')
        print(f"Starting server on port {port}")
        print(f"Make sure frontend is configured to connect to port {port}")
        app.run(debug=True, port=port, host=host)
    except Exception as e:
        print(f"Failed to start server: {str(e)}")
        exit(1)