import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface EmergencyContact {
  name: string;
  location: string;
  phone: string;
  type: 'hospital' | 'police';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      name: 'Civil Hospital',
      location: 'Civil Hospital, Surat',
      phone: '0261-2240000',
      type: 'hospital'
    },
    {
      name: 'New Civil Hospital',
      location: 'New Civil Hospital, Surat',
      phone: '0261-2244444',
      type: 'hospital'
    },
    {
      name: 'Surat Police Station',
      location: 'Surat Police Station',
      phone: '100',
      type: 'police'
    },
    {
      name: 'Athwa Police Station',
      location: 'Athwa Police Station, Surat',
      phone: '0261-2471000',
      type: 'police'
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const updatedContacts = await Promise.all(
          contacts.map(async (contact) => {
            try {
              const response = await api.ltoc(contact.location);
              return {
                ...contact,
                coordinates: response.location
              };
            } catch (error) {
              console.error(`Error fetching coordinates for ${contact.name}:`, error);
              return contact;
            }
          })
        );
        setContacts(updatedContacts);
      } catch (error) {
        toast.error('Error fetching location coordinates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, []);

  const getMarkerIcon = (type: 'hospital' | 'police') => {
    return L.icon({
      iconUrl: type === 'hospital' 
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };

  const center: [number, number] = [21.1702, 72.8311]; // Surat coordinates

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Emergency Contacts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {contacts.map((contact, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-gray-600">{contact.location}</p>
              </div>
              <a 
                href={`tel:${contact.phone}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {contacts.map((contact, index) => {
            if (!contact.coordinates) return null;
            return (
              <Marker
                key={index}
                position={[contact.coordinates.lat, contact.coordinates.lng]}
                icon={getMarkerIcon(contact.type)}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{contact.name}</h3>
                    <p>{contact.location}</p>
                    <p className="text-blue-500">
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default EmergencyContacts; 