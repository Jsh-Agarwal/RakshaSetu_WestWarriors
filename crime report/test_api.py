import requests
import json
import os
from pprint import pprint

BASE_URL = 'http://localhost:5000'

def test_endpoints():
    # Test 1: Get encryption key
    print("\n1. Testing encryption key endpoint...")
    response = requests.get(f'{BASE_URL}/encryption-key')
    encryption_key = response.json()['key']
    print(f"Encryption Key Retrieved: {encryption_key[:20]}...")

    # Test 2: Submit a report without file
    print("\n2. Testing report submission without file...")
    data = {
        'description': 'Test crime report',
        'location': 'Test location'
    }
    response = requests.post(f'{BASE_URL}/report', data=data)
    print(f"Report Submission Response: {response.json()}")
    
    # Test 3: Submit a report with file
    print("\n3. Testing report submission with file...")
    test_file_content = b"This is a test file"
    files = {
        'evidence': ('test.txt', test_file_content, 'text/plain')
    }
    data = {
        'description': 'Test crime report with file',
        'location': 'Test location with file'
    }
    response = requests.post(f'{BASE_URL}/report', data=data, files=files)
    print(f"Report with File Response: {response.json()}")
    
    # Test 4: Get all reports
    print("\n4. Testing get all reports...")
    response = requests.get(f'{BASE_URL}/reports')
    reports = response.json()
    print(f"Total Reports: {reports['total']}")
    print("Latest Report:", json.dumps(reports['reports'][0], indent=2))

def test_get_specific_report():
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
        files=files
    )
    assert response.status_code == 200
    report_data = response.json()
    assert 'report_id' in report_data
    
    # Get the specific report
    response = requests.get(
        f'{BASE_URL}/reports/{report_data["report_id"]}'
    )
    assert response.status_code == 200
    report = response.json()
    assert report['description'] == data['description']
    assert report['location'] == data['location']
    assert 'id' in report
    assert 'timestamp' in report
    assert 'status' in report
    assert 'evidence' in report
    
    # Test invalid report ID
    response = requests.get(
        f'{BASE_URL}/reports/invalid_id'
    )
    assert response.status_code == 400

if __name__ == "__main__":
    test_endpoints()
    test_get_specific_report()
