from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from models import db, User, Admin, StorageUnit, Booking, Payment, TransportationRequest, Feature
from config import Config
from schema import ma, storage_schema, storages_schema, feature_schema, features_schema, booking_schema, bookings_schema
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and admin.check_password(password):
        access_token = create_access_token(identity=admin.admin_id)
        return jsonify({
            'access_token': access_token,
            'admin': {
                'id': admin.admin_id,
                'username': admin.username,
                'role': admin.role
            }
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/units', methods=['GET'])
def get_units():
    units = StorageUnit.query.all()
    return jsonify(storages_schema.dump(units)), 200


@app.route('/api/units/<int:unit_id>', methods=['GET'])
def get_unit(unit_id):
    unit = StorageUnit.query.get_or_404(unit_id)
    return jsonify(storage_schema.dump(unit)), 200


@app.route('/api/units', methods=['POST'])
def create_unit():
    data = request.get_json()

    unit = StorageUnit(
        unit_number=data['unit_number'],
        site=data['site'],
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
    return jsonify(storage_schema.dump(unit)), 201


@app.route('/api/units/<int:unit_id>', methods=['PUT', 'PATCH'])
def update_unit(unit_id):
    unit = StorageUnit.query.get_or_404(unit_id)
    data = request.get_json()

    unit.unit_number = data.get('unit_number', unit.unit_number)
    unit.site = data.get('site', unit.site)
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
    return jsonify(storage_schema.dump(unit)), 200


@app.route('/api/units/<int:unit_id>', methods=['DELETE'])
def delete_unit(unit_id):
    unit = StorageUnit.query.get_or_404(unit_id)
    db.session.delete(unit)
    db.session.commit()
    return jsonify({"message": "Storage unit deleted successfully"}), 200


@app.route('/api/features', methods=['GET'])
def get_features():
    features = Feature.query.all()
    return jsonify(features_schema.dump(features)), 200


@app.route('/api/features', methods=['POST'])
def add_feature():
    data = request.get_json()
    feature = Feature(name=data['name'])
    db.session.add(feature)
    db.session.commit()
    return jsonify(feature_schema.dump(feature)), 201

@app.route('/api/admin/units', methods=['POST'])
def admin_create_unit():
    data = request.get_json()
    
    unit = StorageUnit(
        unit_number=data['unit_number'],
        site=data['site'],
        monthly_rate=data['monthly_rate'],
        status=data.get('status', 'available'),
        location=data.get('location')
    )
    
    db.session.add(unit)
    db.session.commit()
    return jsonify(storage_schema.dump(unit)), 201


@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    booking = Booking(
        user_id=data['user_id'],
        unit_id=data['unit_id'],
        start_date=data['start_date'],
        end_date=data['end_date'],
        total_cost=data['total_cost'],
        status=data.get('status', 'pending')
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking_schema.dump(booking)), 201


@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    return jsonify(bookings_schema.dump(bookings)), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)