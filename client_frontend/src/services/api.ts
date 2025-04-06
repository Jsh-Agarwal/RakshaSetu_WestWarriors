import axios from 'axios';
import FormData from 'form-data';

const baseUrl = "http://localhost:3000"; // You might want to move this to an environment variable

interface Location {
  lat: number;
  lng: number;
}

interface LocationData {
  clientId?: string;
  location: Location;
}

interface TextObject {
  text: string;
  clientId: string;
}

interface SOS {
  timestamp: string;
  location: string;
  user: string;
  id: string;
}

interface AuthResponse {
  token: string;
  message: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  aadhaar: string;
  password: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  aadhaar: string;
}

interface LocationResponse {
  location: Location;
}

interface Incident {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  severity: string;
  timestamp: string;
}

export const api = {
  // Mark a new location
  async markLocation(location: Location) {
    try {
      const response = await axios.post(`${baseUrl}/mark-location`, { location }, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log("Location marked:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error marking location:", error.message);
      throw error;
    }
  },

  // Get all marked locations
  async getMarkedLocations(myLocation: Location) {
    try {
      const response = await axios.post(`${baseUrl}/get-marked-locations`, { location: myLocation }, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log("Marked locations:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error fetching marked locations:", error.message);
      throw error;
    }
  },

  // Get nearby hospitals
  async getNearbyHospitals(location: Location) {
    try {
      const response = await axios.post(`${baseUrl}/nearby-hospitals`, location, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error.message);
      throw error;
    }
  },

  // Get nearby police stations
  async getNearbyPoliceStations(location: Location) {
    try {
      const response = await axios.post(`${baseUrl}/nearby-police-stations`, location, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching nearby police stations:", error.message);
      throw error;
    }
  },

  // Upload video
  async uploadVideo(file: Buffer | File, clientId: string = "0", fileName: string = 'videofile.mp4') {
    const formData = new FormData();
    formData.append('video', file, { filename: fileName });
    formData.append('clientId', clientId);

    try {
      const response = await axios.post(`${baseUrl}/upload/video`, formData, {
        headers: {
          ...formData.getHeaders()
        },
        maxBodyLength: Infinity
      });
      console.log("Upload response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Upload error:", error.message);
      throw error;
    }
  },

  // Upload audio
  async uploadAudio(file: Buffer | File, clientId: string = "0", fileName: string = 'audiofile.mp4') {
    const formData = new FormData();
    formData.append('audio', file, { filename: fileName });
    formData.append('clientId', clientId);

    try {
      const response = await axios.post(`${baseUrl}/upload/audio`, formData, {
        headers: {
          ...formData.getHeaders()
        },
        maxBodyLength: Infinity
      });
      console.log("Upload response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Upload error:", error.message);
      throw error;
    }
  },

  // Upload text
  async uploadText(textObject: TextObject) {
    try {
      const response = await axios.post(`${baseUrl}/send-text`, textObject, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error sending text:", error.message);
      throw error;
    }
  },

  // Sync location
  async syncLocation(locationData: LocationData) {
    try {
      const response = await axios.post(`${baseUrl}/sync-location`, locationData, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error syncing location:", error.message);
      throw error;
    }
  },

  // Get safest path
  async getSafestPath(start: Location, end: Location) {
    try {
      const response = await axios.post(`${baseUrl}/find-safest-path`, { start, end }, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log("Safest path:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error fetching safest path:", error.message);
      throw error;
    }
  },

  // Get patrolling path
  async getPatrollingPath(myLocation: LocationData) {
    try {
      const response = await axios.post(`${baseUrl}/find-patrolling-path`, myLocation, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching patrolling path:", error.message);
      throw error;
    }
  },

  // Get SOS
  async getSOS() {
    try {
      const response = await axios.get(`${baseUrl}/get-soss`);
      console.log("SOS Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting SOS:", error.message);
      throw error;
    }
  },

  // Send SOS
  async sendSOS(sos: { sos: SOS }) {
    try {
      const response = await axios.post(`${baseUrl}/add-soss`, sos, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log("SOS sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending SOS:", error.message);
      throw error;
    }
  },

  // Authentication endpoints
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  signup: async (userData: UserData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  async sendOtp(email: string): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${baseUrl}/send-otp`, { email });
      return response.data;
    } catch (error) {
      console.error("OTP sending error:", error);
      throw error;
    }
  },

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${baseUrl}/verify-otp`, { email, otp });
      return response.data;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear all auth-related data
      localStorage.clear();
      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${baseUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  ltoc: async (locationString: string): Promise<LocationResponse> => {
    try {
      const response = await axios.post(`${baseUrl}/l-to-c`, {
        location: locationString
      });
      return response.data;
    } catch (error) {
      console.error("Error in ltoc:", error);
      throw error;
    }
  },

  getIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await fetch(`${baseUrl}/incidents`);
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  },
};