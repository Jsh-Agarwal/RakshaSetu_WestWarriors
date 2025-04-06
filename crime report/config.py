import os
from cryptography.fernet import Fernet
import base64

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET', 'default-secret-key')
    UPLOAD_FOLDER = 'uploads'
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/crime_reports')
    
    # Simplified Fernet key handling
    FERNET_KEY = os.getenv('FERNET_KEY').encode() if os.getenv('FERNET_KEY') else Fernet.generate_key()

class TestConfig(Config):
    TESTING = True
    MONGODB_URI = 'mongodb://localhost:27017/crime_reports_test'
    
class DevelopmentConfig(Config):
    DEBUG = True
