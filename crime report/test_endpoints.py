import os
import unittest
import requests
from app import create_app
from config import TestConfig
import json
from dotenv import load_dotenv

load_dotenv()

app, db = create_app(TestConfig)

# Start the Flask app in a separate thread for testing
import threading
server = threading.Thread(target=app.run)
server.daemon = True
server.start()

BASE_URL = 'http://localhost:5000'
token = None

def ensure_test_files():
    """Ensure test files exist before running tests"""
    test_assets_dir = os.path.join(os.path.dirname(__file__), 'test_assets')
    os.makedirs(test_assets_dir, exist_ok=True)
    
    # Create test.txt if it doesn't exist
    txt_path = os.path.join(test_assets_dir, 'test.txt')
    if not os.path.exists(txt_path):
        with open(txt_path, 'w') as f:
            f.write('Test evidence content')
    return test_assets_dir

def test_register():
    data = {
        'username': 'testuser',
        'password': 'testpass123',
        'role': 'citizen'
    }
    response = requests.post(f'{BASE_URL}/register', json=data)
    print('Register Test:', response.status_code, response.json())
    assert response.status_code == 201

def test_login():
    global token
    data = {
        'username': 'testuser',
        'password': 'testpass123'
    }
    response = requests.post(f'{BASE_URL}/login', json=data)
    print('Login Test:', response.status_code, response.json())
    assert response.status_code == 200
    token = response.json().get('token')

def test_submit_report():
    headers = {'Authorization': f'Bearer {token}'}
    test_assets_dir = ensure_test_files()
    
    test_file_path = os.path.join(test_assets_dir, 'test.txt')
    with open(test_file_path, 'rb') as f:
        files = {'evidence': ('test.txt', f, 'text/plain')}
        data = {
            'description': 'Test crime report',
            'location': 'Test location'
        }
        
        response = requests.post(
            f'{BASE_URL}/report',
            data=data,
            files=files,
            headers=headers
        )
    
    print('Submit Report Test:', response.status_code, response.text)
    assert response.status_code == 200

def test_submit_report_with_different_files():
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test different file types
    test_files = {
        'text': ('test.txt', b'Test content', 'text/plain'),
        'image': ('test.png', b'PNG content', 'image/png'),
        'audio': ('test.wav', b'WAV content', 'audio/wav'),
        'video': ('test.mp4', b'MP4 content', 'video/mp4')
    }
    
    for file_type, file_data in test_files.items():
        data = {
            'description': f'Test crime report with {file_type}',
            'location': 'Test location'
        }
        files = {'evidence': file_data}
        
        response = requests.post(
            f'{BASE_URL}/report',
            data=data,
            files=files,
            headers=headers
        )
        print(f'Submit Report Test ({file_type}):', response.status_code, response.text)
        assert response.status_code == 200

def test_report_error_cases():
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'multipart/form-data'
    }
    
    # Test missing fields
    response = requests.post(
        f'{BASE_URL}/report',
        data={},  # Empty data
        headers=headers
    )
    print('Test missing fields:', response.status_code, response.json())
    assert response.status_code == 400

    # Test completely empty request
    response = requests.post(
        f'{BASE_URL}/report',
        headers={'Authorization': f'Bearer {token}'}
    )
    print('Test empty request:', response.status_code, response.json())
    assert response.status_code == 400

    # Test wrong content type
    response = requests.post(
        f'{BASE_URL}/report',
        json={'description': 'test', 'location': 'test'},
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    )
    print('Test wrong content type:', response.status_code, response.json())
    assert response.status_code == 415

    # Test invalid file type
    data = {
        'description': 'Test report',
        'location': 'Test location'
    }
    files = {
        'evidence': ('malicious.exe', b'bad content', 'application/x-msdownload')
    }
    response = requests.post(
        f'{BASE_URL}/report',
        data=data,
        files=files,
        headers=headers
    )
    print('Test invalid file:', response.status_code, response.json())
    assert response.status_code == 400

    # Test large file (create a file larger than MAX_FILE_SIZE)
    large_content = b'x' * (16 * 1024 * 1024 + 1)  # Slightly larger than 16MB
    files = {
        'evidence': ('large.txt', large_content, 'text/plain')
    }
    response = requests.post(
        f'{BASE_URL}/report',
        data=data,
        files=files,
        headers=headers
    )
    print('Test large file:', response.status_code, response.json())
    assert response.status_code == 400

def test_get_specific_report():
    headers = {'Authorization': f'Bearer {token}'}
    
    # First submit a report
    data = {
        'description': 'Test specific report',
        'location': 'Test location'
    }
    files = {
        'evidence': ('test.txt', b'test content', 'text/plain')
    }
    
    response = requests.post(
        f'{BASE_URL}/report',
        data=data,
        files=files,
        headers=headers
    )
    assert response.status_code == 200
    report_data = response.json()
    assert 'report_id' in report_data
    
    # Get the specific report
    response = requests.get(
        f'{BASE_URL}/reports/{report_data["report_id"]}',
        headers=headers
    )
    assert response.status_code == 200
    report = response.json()
    assert report['description'] == data['description']
    assert report['location'] == data['location']
    
    # Test invalid report ID
    response = requests.get(
        f'{BASE_URL}/reports/invalid_id',
        headers=headers
    )
    assert response.status_code == 400

def test_get_reports():
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test default pagination
    response = requests.get(f'{BASE_URL}/reports', headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert all(key in data for key in ['reports', 'page', 'per_page', 'total', 'total_pages'])
    
    # Test custom pagination
    response = requests.get(f'{BASE_URL}/reports?page=1&per_page=5', headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data['per_page'] == 5
    
    # Test invalid pagination
    response = requests.get(f'{BASE_URL}/reports?page=0&per_page=0', headers=headers)
    assert response.status_code == 400

def test_get_encryption_key():
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/encryption-key', headers=headers)
    print('Get Encryption Key Test:', response.status_code, response.json())
    assert response.status_code == 200
    assert 'key' in response.json()

if __name__ == '__main__':
    print("Running API Tests...")
    ensure_test_files()  # Ensure test files exist before running tests
    test_register()
    test_login()
    test_submit_report()
    test_submit_report_with_different_files()
    test_report_error_cases()
    test_get_specific_report()
    test_get_reports()
    test_get_encryption_key()
    print("All tests completed!")
