class CrimeReportAPI {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('crimeToken');
        this.encryptionKey = null;
    }

    async login(username, password) {
        const response = await fetch(`${this.baseURL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            this.token = data.token;
            localStorage.setItem('crimeToken', data.token);
            await this.getEncryptionKey();
        }
        return data;
    }

    async getEncryptionKey() {
        const response = await fetch(`${this.baseURL}/encryption-key`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        const data = await response.json();
        if (response.ok) {
            this.encryptionKey = data.key;
            sessionStorage.setItem('encryptionKey', data.key);
        }
        return data;
    }

    async submitReport(description, location, evidenceFile) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('location', location);
        if (evidenceFile) {
            formData.append('evidence', evidenceFile);
        }

        const response = await fetch(`${this.baseURL}/report`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.token}` },
            body: formData
        });
        return await response.json();
    }

    async getReports(page = 1, perPage = 10) {
        const response = await fetch(
            `${this.baseURL}/reports?page=${page}&per_page=${perPage}`,
            { headers: { 'Authorization': `Bearer ${this.token}` } }
        );
        return await response.json();
    }
}

// Usage example:
/*
const api = new CrimeReportAPI();

// Login
await api.login('username', 'password');

// Submit report
const file = document.querySelector('input[type="file"]').files[0];
await api.submitReport('Crime description', 'Location', file);

// Get reports
const reports = await api.getReports(1, 10);
*/
