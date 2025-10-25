from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token
from flask_restful import Api, Resource
from models import db, User, Admin, StorageUnit, Booking, Feature
from config import Config
from schema import ma, storage_schema, storages_schema, feature_schema, features_schema, booking_schema, bookings_schema

app = Flask(_name_)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)

# Admin Login 
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