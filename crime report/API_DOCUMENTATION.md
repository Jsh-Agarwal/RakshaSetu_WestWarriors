# Crime Report API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require JWT authentication. Send the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### 1. Register User
```http
POST /register
Content-Type: application/json

{
    "username": "string",
    "password": "string",
    "role": "citizen" // or "admin"
}

Response (201):
{
    "message": "User created",
    "user_id": "string"
}
```

### 2. Login
```http
POST /login
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}

Response (200):
{
    "token": "JWT_TOKEN_STRING"
}
```

### 3. Get Encryption Key
```http
GET /encryption-key
Authorization: Bearer <token>

Response (200):
{
    "key": "ENCRYPTION_KEY_STRING",
    "note": "Store this key securely"
}
```

### 4. Submit Report
```http
POST /report
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- description: string
- location: string
- evidence: file (optional)

Response (200):
{
    "status": "success",
    "report_id": "string",
    "evidence_count": number
}
```

### 5. Get All Reports (Paginated)
```http
GET /reports?page=1&per_page=10
Authorization: Bearer <token>

Response (200):
{
    "reports": [
        {
            "id": "string",
            "description": "string",
            "location": "string",
            "timestamp": "datetime",
            "status": "string",
            "evidence": [
                {
                    "fileUrl": "string",
                    "fileType": "string",
                    "fileSize": number
                }
            ]
        }
    ],
    "page": number,
    "per_page": number,
    "total": number,
    "total_pages": number
}
```

### 6. Get Specific Report
```http
GET /reports/<report_id>
Authorization: Bearer <token>

Response (200):
{
    "id": "string",
    "description": "string",
    "location": "string",
    "timestamp": "datetime",
    "status": "string",
    "evidence": [
        {
            "fileUrl": "string",
            "fileType": "string",
            "fileSize": number
        }
    ],
    "reporter_id": "string"
}
```

### 7. Download Evidence
```http
GET /reports/<report_id>/evidence/<filename>
Authorization: Bearer <token>

Response (200):
Binary file download
```

## File Upload Specifications
- Allowed file types: png, jpg, jpeg, mp4, wav, pdf, txt
- Maximum file size: 16MB

## Error Responses
```http
400 Bad Request:
{
    "error": "Error description"
}

401 Unauthorized:
{
    "error": "Token missing" or "Invalid token"
}

403 Forbidden:
{
    "error": "Unauthorized access"
}

404 Not Found:
{
    "error": "Resource not found"
}

415 Unsupported Media Type:
{
    "error": "Invalid content type"
}

500 Internal Server Error:
{
    "error": "Error description"
}
```

## Example Usage with Provided Frontend Client

```javascript
// Initialize API client
const api = new CrimeReportAPI();

// Login
try {
    const loginResult = await api.login('username', 'password');
    console.log('Logged in:', loginResult);
} catch (error) {
    console.error('Login failed:', error);
}

// Submit a report
try {
    const file = document.querySelector('input[type="file"]').files[0];
    const result = await api.submitReport(
        'Suspicious activity observed',
        '123 Main Street',
        file
    );
    console.log('Report submitted:', result);
} catch (error) {
    console.error('Submit failed:', error);
}

// Get reports with pagination
try {
    const reports = await api.getReports(1, 10);
    console.log('Reports:', reports);
} catch (error) {
    console.error('Failed to fetch reports:', error);
}
```

## Important Notes
1. Always store the encryption key securely (preferably in memory only)
2. Token expires after 24 hours
3. File uploads must be multipart/form-data
4. All timestamps are in UTC
5. Descriptions and locations are encrypted in storage
