import axios from 'axios';

const baseUrl = "http://localhost:3000"; // You might want to move this to an environment variable

interface Location {
  lat: number;
  lng: number;
}

interface LocationData {
  clientId?: string;
  location: Location;
}

export const api = {
  // Mark a new location
  async markLocation(location: Location) {
    try {
      const response = await axios.post(`${baseUrl}/mark-location`, { location });
      return response.data;
    } catch (error) {
      console.error("Error marking location:", error);
      throw error;
    }
  },

  // Get all marked locations
  async getMarkedLocations(myLocation: Location) {
    try {
      const response = await axios.post(`${baseUrl}/get-marked-locations`, { location: myLocation });
      return response.data;
    } catch (error) {
      console.error("Error fetching marked locations:", error);
      throw error;
    }
  },

  // Get nearby hospitals
  async getNearbyHospitals(location: Location) {
    try {
      const response = await axios.post(`${baseUrl}/nearby-hospitals`, location);
      return response.data;
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
      throw error;
    }
  },

  // Get nearby police stations
  async getNearbyPoliceStations(location: Location) {
    try {
      const response = await axios.post(`${baseUrl}/nearby-police-stations`, location);
      return response.data;
    } catch (error) {
      console.error("Error fetching nearby police stations:", error);
      throw error;
    }
  },

  // Upload video
  async uploadVideo(file: File, clientId: string = "0") {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('clientId', clientId);

    try {
      const response = await axios.post(`${baseUrl}/upload/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  },

  // Upload audio
  async uploadAudio(file: File, clientId: string = "0") {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('clientId', clientId);

    try {
      const response = await axios.post(`${baseUrl}/upload/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }
  },

  // Upload text
  async uploadText(text: string, clientId: string = "0") {
    try {
      const response = await axios.post(`${baseUrl}/send-text`, { text, clientId });
      return response.data;
    } catch (error) {
      console.error("Error sending text:", error);
      throw error;
    }
  },

  // Sync location
  async syncLocation(locationData: LocationData) {
    try {
      const response = await axios.post(`${baseUrl}/sync-location`, locationData);
      return response.data;
    } catch (error) {
      console.error("Error syncing location:", error);
      throw error;
    }
  },

  // Get safest path
  async getSafestPath(start: Location, end: Location) {
    try {
      const response = await axios.post(`${baseUrl}/find-safest-path`, { start, end });
      return response.data;
    } catch (error) {
      console.error("Error fetching safest path:", error);
      throw error;
    }
  }
};