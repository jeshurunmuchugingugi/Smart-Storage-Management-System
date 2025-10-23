# config.py
import os

# basedir = os.path.abspath(os.path.dirname(_file_))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///storage.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'supersecretkey'
    JWT_SECRET_KEY = 'jwt-secret-string'