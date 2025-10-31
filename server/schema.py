# Input validation functions (replacing marshmallow schemas)
from datetime import date, datetime
import re

class ValidationError(Exception):
    pass

def validate_admin_login(data):
    """Validate admin login input"""
    if not data or 'username' not in data or 'password' not in data:
        raise ValidationError('Username and password are required')

    username = data['username'].strip()
    password = data['password']

    if not username or len(username) < 1 or len(username) > 50:
        raise ValidationError('Username must be between 1 and 50 characters')

    if not password or len(password) < 1:
        raise ValidationError('Password is required')

    return {'username': username, 'password': password}

def validate_storage_unit(data, partial=False):
    """Validate storage unit input"""
    if not data:
        raise ValidationError('No data provided')

    result = {}

    # Required fields
    if not partial or 'unit_number' in data:
        unit_number = data.get('unit_number', '').strip()
        if not unit_number or len(unit_number) < 1 or len(unit_number) > 20:
            raise ValidationError('Unit number must be between 1 and 20 characters')
        result['unit_number'] = unit_number

    if not partial or 'site' in data:
        site = data.get('site', '').strip()
        if not site or len(site) < 1 or len(site) > 50:
            raise ValidationError('Site must be between 1 and 50 characters')
        result['site'] = site

    if not partial or 'monthly_rate' in data:
        monthly_rate = data.get('monthly_rate')
        if monthly_rate is None:
            raise ValidationError('Monthly rate is required')
        try:
            monthly_rate = float(monthly_rate)
            if monthly_rate < 0:
                raise ValidationError('Monthly rate must be non-negative')
        except (ValueError, TypeError):
            raise ValidationError('Monthly rate must be a valid number')
        result['monthly_rate'] = monthly_rate

    # Optional fields
    if 'size' in data:
        size = data['size']
        if size is not None:
            try:
                size = float(size)
                if size < 0:
                    raise ValidationError('Size must be non-negative')
            except (ValueError, TypeError):
                raise ValidationError('Size must be a valid number')
        result['size'] = size

    if 'status' in data:
        status = data['status']
        if status not in ['available', 'booked']:
            raise ValidationError('Status must be either available or booked')
        result['status'] = status
    else:
        result['status'] = 'available'

    if 'location' in data:
        location = data.get('location', '').strip()
        if len(location) > 100:
            raise ValidationError('Location must be at most 100 characters')
        result['location'] = location

    if 'features' in data:
        features = data['features']
        if not isinstance(features, list):
            raise ValidationError('Features must be a list')
        result['features'] = [str(f).strip() for f in features]
    else:
        result['features'] = []

    return result

def validate_booking(data):
    """Validate booking input"""
    if not data:
        raise ValidationError('No data provided')

    result = {}

    # Required fields
    if 'unit_id' not in data:
        raise ValidationError('Unit ID is required')
    try:
        unit_id = int(data['unit_id'])
        if unit_id <= 0:
            raise ValidationError('Unit ID must be a positive integer')
    except (ValueError, TypeError):
        raise ValidationError('Unit ID must be a valid integer')
    result['unit_id'] = unit_id

    customer_name = data.get('customer_name', '').strip()
    if not customer_name or len(customer_name) < 1 or len(customer_name) > 100:
        raise ValidationError('Customer name must be between 1 and 100 characters')
    result['customer_name'] = customer_name

    customer_email = data.get('customer_email', '').strip()
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not customer_email or len(customer_email) > 100 or not re.match(email_pattern, customer_email):
        raise ValidationError('Valid email is required and must be at most 100 characters')
    result['customer_email'] = customer_email

    customer_phone = data.get('customer_phone', '').strip()
    if not customer_phone or len(customer_phone) < 1 or len(customer_phone) > 20:
        raise ValidationError('Customer phone must be between 1 and 20 characters')
    result['customer_phone'] = customer_phone

    # Date validation
    try:
        start_date = datetime.fromisoformat(data['start_date']).date() if isinstance(data['start_date'], str) else data['start_date']
        end_date = datetime.fromisoformat(data['end_date']).date() if isinstance(data['end_date'], str) else data['end_date']
    except (ValueError, TypeError):
        raise ValidationError('Invalid date format')

    if start_date >= end_date:
        raise ValidationError('End date must be after start date')
    if start_date < date.today():
        raise ValidationError('Start date cannot be in the past')

    result['start_date'] = start_date
    result['end_date'] = end_date

    if 'total_cost' not in data:
        raise ValidationError('Total cost is required')
    try:
        total_cost = float(data['total_cost'])
        if total_cost < 0:
            raise ValidationError('Total cost must be non-negative')
    except (ValueError, TypeError):
        raise ValidationError('Total cost must be a valid number')
    result['total_cost'] = total_cost

    if 'status' in data:
        status = data['status']
        if status not in ['pending', 'paid', 'active', 'completed', 'cancelled']:
            raise ValidationError('Invalid status')
        result['status'] = status
    else:
        result['status'] = 'pending'

    return result

def validate_payment(data):
    """Validate payment input"""
    if not data:
        raise ValidationError('No data provided')

    result = {}

    if 'booking_id' not in data:
        raise ValidationError('Booking ID is required')
    try:
        booking_id = int(data['booking_id'])
        if booking_id <= 0:
            raise ValidationError('Booking ID must be a positive integer')
    except (ValueError, TypeError):
        raise ValidationError('Booking ID must be a valid integer')
    result['booking_id'] = booking_id

    if 'amount' not in data:
        raise ValidationError('Amount is required')
    try:
        amount = float(data['amount'])
        if amount < 0:
            raise ValidationError('Amount must be non-negative')
    except (ValueError, TypeError):
        raise ValidationError('Amount must be a valid number')
    result['amount'] = amount

    if 'payment_method' in data:
        payment_method = data['payment_method'].strip()
        if len(payment_method) > 30:
            raise ValidationError('Payment method must be at most 30 characters')
        result['payment_method'] = payment_method
    else:
        result['payment_method'] = 'pending'

    if 'status' in data:
        status = data['status']
        if status not in ['pending', 'completed', 'failed']:
            raise ValidationError('Invalid status')
        result['status'] = status
    else:
        result['status'] = 'pending'

    return result

def validate_transportation(data):
    """Validate transportation input"""
    if not data:
        raise ValidationError('No data provided')

    result = {}

    if 'booking_id' not in data:
        raise ValidationError('Booking ID is required')
    try:
        booking_id = int(data['booking_id'])
        if booking_id <= 0:
            raise ValidationError('Booking ID must be a positive integer')
    except (ValueError, TypeError):
        raise ValidationError('Booking ID must be a valid integer')
    result['booking_id'] = booking_id

    customer_name = data.get('customer_name', '').strip()
    if not customer_name or len(customer_name) < 1 or len(customer_name) > 100:
        raise ValidationError('Customer name must be between 1 and 100 characters')
    result['customer_name'] = customer_name

    pickup_address = data.get('pickup_address', '').strip()
    if not pickup_address or len(pickup_address) < 1 or len(pickup_address) > 250:
        raise ValidationError('Pickup address must be between 1 and 250 characters')
    result['pickup_address'] = pickup_address

    try:
        pickup_date = datetime.fromisoformat(data['pickup_date']).date() if isinstance(data['pickup_date'], str) else data['pickup_date']
        pickup_time = datetime.fromisoformat(data['pickup_time']).time() if isinstance(data['pickup_time'], str) else data['pickup_time']
    except (ValueError, TypeError):
        raise ValidationError('Invalid date/time format')

    if pickup_date < date.today():
        raise ValidationError('Pickup date cannot be in the past')

    result['pickup_date'] = pickup_date
    result['pickup_time'] = pickup_time

    if 'distance' in data and data['distance'] is not None:
        try:
            distance = float(data['distance'])
            if distance < 0:
                raise ValidationError('Distance must be non-negative')
            result['distance'] = distance
        except (ValueError, TypeError):
            raise ValidationError('Distance must be a valid number')

    if 'special_instructions' in data:
        special_instructions = data['special_instructions'].strip()
        if len(special_instructions) > 1000:
            raise ValidationError('Special instructions must be at most 1000 characters')
        result['special_instructions'] = special_instructions
    else:
        result['special_instructions'] = ''

    if 'status' in data:
        status = data['status']
        if status not in ['pending', 'scheduled', 'completed', 'cancelled']:
            raise ValidationError('Invalid status')
        result['status'] = status
    else:
        result['status'] = 'pending'

    return result

def validate_mpesa_stk(data):
    """Validate M-Pesa STK input"""
    if not data:
        raise ValidationError('No data provided')

    result = {}

    if 'booking_id' not in data:
        raise ValidationError('Booking ID is required')
    try:
        booking_id = int(data['booking_id'])
        if booking_id <= 0:
            raise ValidationError('Booking ID must be a positive integer')
    except (ValueError, TypeError):
        raise ValidationError('Booking ID must be a valid integer')
    result['booking_id'] = booking_id

    phone_number = data.get('phone_number', '').strip()
    if not phone_number or len(phone_number) < 10 or len(phone_number) > 15:
        raise ValidationError('Phone number must be between 10 and 15 characters')
    result['phone_number'] = phone_number

    if 'amount' not in data:
        raise ValidationError('Amount is required')
    try:
        amount = float(data['amount'])
        if amount < 1:
            raise ValidationError('Amount must be at least 1')
    except (ValueError, TypeError):
        raise ValidationError('Amount must be a valid number')
    result['amount'] = amount

    return result

def validate_mpesa_query(data):
    """Validate M-Pesa query input"""
    if not data or 'checkout_request_id' not in data:
        raise ValidationError('Checkout request ID is required')

    checkout_request_id = data['checkout_request_id'].strip()
    if not checkout_request_id:
        raise ValidationError('Checkout request ID cannot be empty')

    return {'checkout_request_id': checkout_request_id}
