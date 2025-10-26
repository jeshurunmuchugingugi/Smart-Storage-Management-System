from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token
from flask_restful import Api, Resource
from models import db, User, Admin, StorageUnit, Booking, Feature
from config import Config
from schema import ma, storage_schema, storages_schema, feature_schema, features_schema, booking_schema, bookings_schema

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)

class AdminLoginResource(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'error': 'Username and password required'}, 400

        admin = Admin.query.filter_by(username=username).first()

        if admin and admin.check_password(password):
            access_token = create_access_token(identity=admin.admin_id)
            return {
                'access_token': access_token,
                'admin': {
                    'id': admin.admin_id,
                    'username': admin.username,
                    'role': admin.role
                }
            }, 200

        return {'error': 'Invalid credentials'}, 401

class StorageUnitListResource(Resource):
    def get(self):
        units = StorageUnit.query.all()
        return storages_schema.dump(units), 200

    def post(self):
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
        return storage_schema.dump(unit), 201


class StorageUnitResource(Resource):
    def get(self, unit_id):
        unit = StorageUnit.query.get_or_404(unit_id)
        return storage_schema.dump(unit), 200

    def put(self, unit_id):
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
        return storage_schema.dump(unit), 200

    def delete(self, unit_id):
        unit = StorageUnit.query.get_or_404(unit_id)
        db.session.delete(unit)
        db.session.commit()
        return {"message": "Storage unit deleted successfully"}, 200


class FeatureListResource(Resource):
    def get(self):
        features = Feature.query.all()
        return features_schema.dump(features), 200

    def post(self):
        data = request.get_json()
        feature = Feature(name=data['name'])
        db.session.add(feature)
        db.session.commit()
        return feature_schema.dump(feature), 201


class BookingListResource(Resource):
    def get(self):
        bookings = Booking.query.all()
        return bookings_schema.dump(bookings), 200

    def post(self):
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
        return booking_schema.dump(booking), 201


api.add_resource(AdminLoginResource, '/api/admin/login')
api.add_resource(StorageUnitListResource, '/api/units')
api.add_resource(StorageUnitResource, '/api/units/<int:unit_id>')
api.add_resource(FeatureListResource, '/api/features')
api.add_resource(BookingListResource, '/api/bookings')

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