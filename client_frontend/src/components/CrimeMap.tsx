import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '@/services/api';

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create custom icons for different incident types
const incidentIcons = {
  theft: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  assault: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  accident: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  default: defaultIcon
};

// Set default icon for all markers
L.Marker.prototype.options.icon = defaultIcon;

// Fix for marker icons not showing up
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface CrimeLocation {
  lat: number;
  lng: number;
  type: string;
  description: string;
  timestamp: string;
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

const CrimeMap: React.FC = () => {
  const [crimeLocations, setCrimeLocations] = useState<CrimeLocation[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              // Fetch both crime locations and incidents
              const [locationsData, incidentsData] = await Promise.all([
                api.getMarkedLocations({ lat: latitude, lng: longitude }),
                api.getIncidents()
              ]);
              
              setCrimeLocations(locationsData.nearbyLocations || []);
              setIncidents(incidentsData || []);
              setLoading(false);
            },
            (error) => {
              console.error('Error getting location:', error);
              setError('Could not get your location. Please enable location services.');
              setLoading(false);
            }
          );
        } else {
          setError('Geolocation is not supported by your browser');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIconForIncident = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('theft')) return incidentIcons.theft;
    if (normalizedType.includes('assault')) return incidentIcons.assault;
    if (normalizedType.includes('accident')) return incidentIcons.accident;
    return incidentIcons.default;
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-raksha-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[21.1702, 72.8311]} // Surat coordinates
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render crime locations */}
        {crimeLocations.map((location, index) => (
          <Marker
            key={`crime-${index}`}
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{location.type}</h3>
                <p className="text-sm">{location.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(location.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render incidents */}
        {incidents.map((incident) => (
          <Marker
            key={`incident-${incident.id}`}
            position={[incident.location.lat, incident.location.lng]}
            icon={getIconForIncident(incident.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{incident.type}</h3>
                <p className="text-sm">{incident.description}</p>
                <p className="text-xs text-gray-500">
                  Severity: {incident.severity}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(incident.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CrimeMap; 