from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Api, Resource
from models import db, User, Admin, StorageUnit, Booking, Feature, Payment, TransportationRequest
from config import Config
from schema import ma, storage_schema, storages_schema, feature_schema, features_schema, booking_schema, bookings_schema, payment_schema, payments_schema
from datetime import datetime, date
import logging
import uuid
import os
from mpesa_service import MpesaService
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS properly
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
CORS(app, 
     origins=allowed_origins,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
     supports_credentials=True)

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
email_service = EmailService()

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
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
                
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return {'error': 'Username and password required'}, 400

            admin = Admin.query.filter_by(username=username).first()

            if admin and admin.check_password(password):
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
        except Exception as e:
            logging.error(f"Error during admin login: {str(e)}")
            return {'error': 'Login failed'}, 500

class StorageUnitListResource(Resource):
    def get(self):
        try:
            units = StorageUnit.query.all()
            return storages_schema.dump(units), 200
        except Exception as e:
            logging.error(f"Error fetching storage units: {str(e)}")
            return {'error': 'Failed to fetch storage units'}, 500

    @role_required(['admin'])
    def post(self):
        try:
            logging.info("POST /api/units - Creating new storage unit")
            data = request.get_json()
            logging.info(f"Received data: {data}")
            
            if not data:
                return {'error': 'No data provided'}, 400

            required_fields = ['unit_number', 'site', 'monthly_rate']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field: {field}'}, 400

            # Convert size to float if provided, otherwise None
            size_value = None
            if data.get('size'):
                try:
                    size_value = float(data['size'])
                except (ValueError, TypeError):
                    size_value = None
            
            unit = StorageUnit(
                unit_number=data['unit_number'],
                site=data['site'],
                size=size_value,
                monthly_rate=data['monthly_rate'],
                status=data.get('status', 'available'),
                location=data.get('location')
            )

            if 'features' in data:
                for feature_name in data['features']:
                    feature = Feature.query.filter_by(name=feature_name).first()
                    if not feature:
                        feature = Feature(name=feature_name)
                    unit.features.append(feature)

            db.session.add(unit)
            db.session.commit()
            logging.info(f"Successfully created unit: {unit.unit_id}")
            return storage_schema.dump(unit), 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating storage unit: {str(e)}")
            logging.exception("Full traceback:")
            return {'error': f'Failed to create storage unit: {str(e)}'}, 500


class StorageUnitResource(Resource):
    def get(self, unit_id):
        try:
            unit = StorageUnit.query.get_or_404(unit_id)
            return storage_schema.dump(unit), 200
        except Exception as e:
            logging.error(f"Error fetching storage unit {unit_id}: {str(e)}")
            return {'error': 'Storage unit not found'}, 404

    @role_required(['admin'])
    def put(self, unit_id):
        try:
            unit = StorageUnit.query.get_or_404(unit_id)
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400

            unit.unit_number = data.get('unit_number', unit.unit_number)
            unit.site = data.get('site', unit.site)
            
            # Convert size to float if provided
            if 'size' in data:
                try:
                    unit.size = float(data['size']) if data['size'] else None
                except (ValueError, TypeError):
                    unit.size = None
            
            unit.monthly_rate = data.get('monthly_rate', unit.monthly_rate)
            unit.status = data.get('status', unit.status)
            unit.location = data.get('location', unit.location)

            if 'features' in data:
                unit.features.clear()
                for feature_name in data['features']:
                    feature = Feature.query.filter_by(name=feature_name).first()
                    if not feature:
                        feature = Feature(name=feature_name)
                    unit.features.append(feature)

            db.session.commit()
            return storage_schema.dump(unit), 200
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
            return features_schema.dump(features), 200
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
            return feature_schema.dump(feature), 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating feature: {str(e)}")
            return {'error': 'Failed to create feature'}, 500


class BookingListResource(Resource):
    @jwt_required(optional=True)
    def get(self):
        try:
            bookings = Booking.query.all()
            return bookings_schema.dump(bookings), 200
        except Exception as e:
            logging.error(f"Error fetching bookings: {str(e)}")
            return {'error': 'Failed to fetch bookings'}, 500

    def post(self):
        try:
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400

            required_fields = ['unit_id', 'customer_name', 'customer_email', 'customer_phone', 'start_date', 'end_date', 'total_cost']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field: {field}'}, 400

            # Parse dates
            try:
                start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
                end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            except ValueError as e:
                return {'error': f'Invalid date format: {str(e)}'}, 400

            # Validate dates
            if start_date >= end_date:
                return {'error': 'End date must be after start date'}, 400
            if start_date < date.today():
                return {'error': 'Start date cannot be in the past'}, 400

            # Check if unit exists and is available
            unit = StorageUnit.query.get(data['unit_id'])
            if not unit:
                return {'error': 'Storage unit not found'}, 404
            if unit.status != 'available':
                return {'error': 'Storage unit is not available'}, 400

            booking = Booking(
                unit_id=data['unit_id'],
                customer_name=data['customer_name'].strip(),
                customer_email=data['customer_email'].strip(),
                customer_phone=data['customer_phone'].strip(),
                start_date=start_date,
                end_date=end_date,
                total_cost=float(data['total_cost']),
                status=data.get('status', 'pending')
            )
            
            # Update unit status to booked
            unit.status = 'booked'
            
            db.session.add(booking)
            db.session.add(unit)
            db.session.flush()  # Get the booking_id before commit
            
            result = {
                'booking_id': booking.booking_id,
                'unit_id': booking.unit_id,
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
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating booking: {str(e)}")
            return {'error': f'Failed to create booking: {str(e)}'}, 500


class BookingResource(Resource):
    def get(self, booking_id):
        try:
            booking = Booking.query.get_or_404(booking_id)
            return booking_schema.dump(booking), 200
        except Exception as e:
            logging.error(f"Error fetching booking {booking_id}: {str(e)}")
            return {'error': 'Booking not found'}, 404


class PaymentListResource(Resource):
    def get(self):
        try:
            payments = Payment.query.all()
            return payments_schema.dump(payments), 200
        except Exception as e:
            logging.error(f"Error fetching payments: {str(e)}")
            return {'error': 'Failed to fetch payments'}, 500

    def post(self):
        try:
            data = request.get_json(force=True)
            if not data:
                return {'error': 'No data provided'}, 400
            
            required_fields = ['booking_id', 'amount']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field: {field}'}, 400
            
            # Check if booking exists
            booking = Booking.query.get(data['booking_id'])
            if not booking:
                return {'error': 'Booking not found'}, 404
            
            payment = Payment(
                booking_id=data['booking_id'],
                amount=data['amount'],
                payment_method=data.get('payment_method', 'pending'),
                status=data.get('status', 'pending')
            )
            
            # Update booking status to 'paid' when payment is completed
            if data.get('status') == 'completed':
                booking.status = 'paid'
            
            db.session.add(payment)
            db.session.commit()
            return payment_schema.dump(payment), 201
        except (ValueError, TypeError):
            db.session.rollback()
            return {'error': 'Invalid JSON data'}, 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating payment: {str(e)}")
            return {'error': 'Failed to create payment'}, 500


class TransportationResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            required_fields = ['booking_id', 'customer_name', 'pickup_address', 'pickup_date', 'pickup_time']
            for field in required_fields:
                if field not in data or not data[field]:
                    return {'error': f'Missing required field: {field}'}, 400
            
            # Parse dates and times
            try:
                pickup_date = datetime.strptime(data['pickup_date'], '%Y-%m-%d').date()
                pickup_time = datetime.strptime(data['pickup_time'], '%H:%M').time()
            except ValueError as e:
                return {'error': f'Invalid date/time format: {str(e)}'}, 400
            
            # Validate pickup date
            if pickup_date < date.today():
                return {'error': 'Pickup date cannot be in the past'}, 400
            
            transport = TransportationRequest(
                booking_id=data['booking_id'],
                customer_name=data['customer_name'].strip(),
                pickup_address=data['pickup_address'].strip(),
                pickup_date=pickup_date,
                pickup_time=pickup_time,
                distance=float(data['distance']) if data.get('distance') else None,
                special_instructions=data.get('special_instructions', '').strip(),
                status=data.get('status', 'pending')
            )
            db.session.add(transport)
            db.session.commit()
            return {'message': 'Transportation request created', 'request_id': transport.request_id}, 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating transportation request: {str(e)}")
            return {'error': f'Failed to create transportation request: {str(e)}'}, 500


class MpesaSTKPushResource(Resource):
    def post(self):
        """Initiate M-Pesa STK Push payment"""
        try:
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            required_fields = ['booking_id', 'phone_number', 'amount']
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing required field: {field}'}, 400
            
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
            data = request.get_json()
            checkout_request_id = data.get('checkout_request_id')
            
            if not checkout_request_id:
                return {'error': 'checkout_request_id required'}, 400
            
            mpesa = MpesaService()
            result = mpesa.query_stk_status(checkout_request_id)
            
            return result, 200
        except Exception as e:
            logging.error(f"Error querying M-Pesa status: {str(e)}")
            return {'error': str(e)}, 500


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

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization,X-CSRF-Token")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response

@app.route('/api/csrf-token', methods=['GET'])
def get_csrf_token():
    """Generate a simple CSRF token for form submissions"""
    token = str(uuid.uuid4())
    response = jsonify({'csrfToken': token})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
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
        
        port = int(os.getenv('FLASK_PORT', 5001))
        host = os.getenv('FLASK_HOST', '0.0.0.0')
        print(f"Starting server on http://localhost:{port}")
        print(f"Make sure frontend is configured to connect to port {port}")
        app.run(debug=True, port=port, host=host)
    except Exception as e:
        print(f"Failed to start server: {str(e)}")
        exit(1)