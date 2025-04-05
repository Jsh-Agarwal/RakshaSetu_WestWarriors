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
  }
};