from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging
from logging.handlers import RotatingFileHandler
from pymongo import MongoClient, ASCENDING
from cryptography.fernet import Fernet
from werkzeug.utils import secure_filename
import datetime
import os
from dotenv import load_dotenv
from config import Config, TestConfig, DevelopmentConfig
from bson import ObjectId

load_dotenv()

# Setup logging
def setup_logging():
    log_formatter = logging.Formatter('%(asctime)s [%(levelname)s] - %(message)s')
    log_file = 'app.log'
    
    file_handler = RotatingFileHandler(log_file, maxBytes=1024*1024, backupCount=5)
    file_handler.setFormatter(log_formatter)
    
    logger = logging.getLogger('crime_app')
    logger.setLevel(logging.DEBUG)
    logger.addHandler(file_handler)
    
    return logger

logger = setup_logging()

# Move constants to top level
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'wav', 'pdf', 'txt'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# MongoDB connection and initialization
def init_database(app):
    try:
        client = MongoClient(app.config['MONGODB_URI'])
        db = client['crime_reports']
        logger.info("Connected to MongoDB successfully")
        
        # Clear collections for testing
        db.users.delete_many({})
        db.reports.delete_many({})
        logger.info("Cleared existing collections for testing")
        
        # Create indexes
        if 'users' not in db.list_collection_names():
            users = db.create_collection('users')
            users.create_index([('username', ASCENDING)], unique=True)
            logger.info("Created users collection with index")
        else:
            db.users.create_index([('username', ASCENDING)], unique=True)
            logger.info("Updated users collection index")
        
        if 'reports' not in db.list_collection_names():
            reports = db.create_collection('reports')
            reports.create_index([('reporter_id', ASCENDING)])
            logger.info("Created reports collection with index")
        else:
            db.reports.create_index([('reporter_id', ASCENDING)])
            logger.info("Updated reports collection index")
        
        return db
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}", exc_info=True)
        raise

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)
    
    # Load config
    app.config.from_object(config_class)
    
    # Initialize Fernet with config key
    global fernet
    fernet = Fernet(app.config['FERNET_KEY'])
    
    # Base configuration
    app.config.update(
        UPLOAD_FOLDER='uploads',
        ALLOWED_EXTENSIONS=ALLOWED_EXTENSIONS,
        MAX_FILE_SIZE=MAX_FILE_SIZE
    )
    
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize components
    logger = setup_logging()
    db = init_database(app)

    # Add request logging middleware
    @app.before_request
    def log_request_info():
        logger.debug(f"Request: {request.method} {request.path} - Headers: {dict(request.headers)}")

    @app.after_request
    def log_response_info(response):
        logger.debug(f"Response: {response.status} - {response.get_data()}")
        return response

    @app.route('/report', methods=['POST'])
    def submit_report():
        try:
            # Check if there's any data at all
            if not request.form and not request.files and not request.get_json():
                return jsonify({'error': 'Missing required fields'}), 400

            # Validate content type only if data is being sent
            if request.data and 'multipart/form-data' not in request.content_type:
                return jsonify({'error': 'Invalid content type'}), 415

            # Validate required fields
            if not request.form or 'description' not in request.form or 'location' not in request.form:
                logger.warning("Missing required fields in form data")
                return jsonify({'error': 'Missing required fields'}), 400

            evidence_paths = []
            if 'evidence' in request.files:
                file = request.files['evidence']
                if file and file.filename:
                    try:
                        # Validate file
                        if not allowed_file(file.filename):
                            raise ValueError("Invalid file type")

                        # Check file size
                        file.seek(0, os.SEEK_END)
                        size = file.tell()
                        file.seek(0)
                        
                        if size > MAX_FILE_SIZE:
                            raise ValueError("File too large")

                        filename = secure_filename(file.filename)
                        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                        
                        # Ensure upload directory exists
                        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                        
                        file.save(filepath)
                        evidence_paths.append({
                            'fileUrl': filename,
                            'fileType': file.content_type or 'text/plain',
                            'fileSize': size
                        })
                        logger.info(f"Saved evidence file: {filename} ({size} bytes)")
                    except ValueError as ve:
                        return jsonify({'error': str(ve)}), 400
                    except Exception as e:
                        logger.error(f"File processing error: {str(e)}")
                        return jsonify({'error': 'Failed to process file'}), 500

            # Create report with encrypted data
            try:
                report = {
                    'description': fernet.encrypt(request.form['description'].encode()).decode(),
                    'location': fernet.encrypt(request.form['location'].encode()).decode(),
                    'timestamp': datetime.datetime.utcnow(),
                    'status': 'submitted',
                    'evidence': evidence_paths
                }
                
                result = db.reports.insert_one(report)
                return jsonify({
                    'status': 'success',
                    'report_id': str(result.inserted_id),
                    'evidence_count': len(evidence_paths)
                })
            except Exception as e:
                logger.error(f"Database error: {str(e)}")
                # Clean up any saved files if database operation fails
                for evidence in evidence_paths:
                    try:
                        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], evidence['fileUrl']))
                    except:
                        pass
                raise
            
        except Exception as e:
            logger.error(f"Report submission error: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500

    @app.route('/reports', methods=['GET'])
    def get_reports():
        try:
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            
            # Validate pagination parameters
            if page < 1 or per_page < 1 or per_page > 100:
                return jsonify({'error': 'Invalid pagination parameters'}), 400

            query = {}
            
            # Get total count
            total_reports = db.reports.count_documents(query)
            
            # Get paginated reports sorted by timestamp
            reports = []
            cursor = db.reports.find(query).sort('timestamp', -1).skip((page-1)*per_page).limit(per_page)
            
            for report in cursor:
                reports.append({
                    'id': str(report['_id']),
                    'description': fernet.decrypt(report['description'].encode()).decode(),
                    'location': fernet.decrypt(report['location'].encode()).decode(),
                    'timestamp': report['timestamp'],
                    'status': report['status'],
                    'evidence': report.get('evidence', [])
                })
            
            return jsonify({
                'reports': reports,
                'page': page,
                'per_page': per_page,
                'total': total_reports,
                'total_pages': (total_reports + per_page - 1) // per_page
            })
        except ValueError:
            return jsonify({'error': 'Invalid pagination parameters'}), 400
        except Exception as e:
            logger.error(f"Get reports error: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/reports/<report_id>', methods=['GET'])
    def get_report_by_id(report_id):
        try:
            if not ObjectId.is_valid(report_id):
                return jsonify({'error': 'Invalid report ID format'}), 400
                
            report = db.reports.find_one({'_id': ObjectId(report_id)})
            if not report:
                return jsonify({'error': 'Report not found'}), 404

            decrypted_report = {
                'id': str(report['_id']),
                'description': fernet.decrypt(report['description'].encode()).decode(),
                'location': fernet.decrypt(report['location'].encode()).decode(),
                'timestamp': report['timestamp'],
                'status': report['status'],
                'evidence': report.get('evidence', [])
            }
            return jsonify(decrypted_report)
        except Exception as e:
            logger.error(f"Get report by ID error: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/reports/<report_id>/evidence/<filename>', methods=['GET'])
    def get_evidence(report_id, filename):
        try:
            report = db.reports.find_one({'_id': ObjectId(report_id)})
            if not report:
                return jsonify({'error': 'Report not found'}), 404

            evidence_exists = any(e['fileUrl'] == filename for e in report.get('evidence', []))
            if not evidence_exists:
                return jsonify({'error': 'Evidence not found'}), 404

            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if not os.path.exists(file_path):
                return jsonify({'error': 'Evidence file missing'}), 404

            return send_file(file_path, as_attachment=True)
        except Exception as e:
            logger.error(f"Get evidence error: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/encryption-key', methods=['GET'])
    def get_encryption_key():
        """Provide encryption key"""
        try:
            return jsonify({
                'key': app.config['FERNET_KEY'].decode(),
                'note': 'Store this key securely'
            })
        except Exception as e:
            logger.error(f"Key retrieval error: {e}")
            return jsonify({'error': 'Key retrieval failed'}), 500

    @app.route('/api-docs', methods=['GET'])
    def api_documentation():
        """Provide API documentation for frontend"""
        return jsonify({
            'endpoints': {
                'register': {
                    'method': 'POST',
                    'url': '/register',
                    'body': {'username': 'string', 'password': 'string', 'role': 'string'},
                    'description': 'Register new user'
                },
                'login': {
                    'method': 'POST',
                    'url': '/login',
                    'body': {'username': 'string', 'password': 'string'},
                    'description': 'Login and get token'
                },
                'submit_report': {
                    'method': 'POST',
                    'url': '/report',
                    'body': {'description': 'string', 'location': 'string', 'evidence': 'file'},
                    'description': 'Submit new crime report'
                },
                'get_reports': {
                    'method': 'GET',
                    'url': '/reports',
                    'query': {'page': 'number', 'per_page': 'number'},
                    'description': 'Get paginated reports'
                },
                'get_encryption_key': {
                    'method': 'GET',
                    'url': '/encryption-key',
                    'description': 'Get encryption key for data handling'
                }
            },
            'allowed_files': list(ALLOWED_EXTENSIONS),
            'max_file_size': MAX_FILE_SIZE
        })

    return app, db

# Create the application instance
app, db = create_app(Config)

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(debug=True)
