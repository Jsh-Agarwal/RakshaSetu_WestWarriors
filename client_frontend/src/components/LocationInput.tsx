import React from 'react';
import { Input } from './ui/input';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  useCurrentLocation?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  value,
  onChange,
  onLocationSelect,
  useCurrentLocation = false,
  inputRef,
  className
}) => {
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const suggestion: LocationSuggestion = {
              place_id: Date.now(), // Using timestamp as a unique ID
              display_name: data.display_name,
              lat: latitude.toString(),
              lon: longitude.toString()
            };
            onLocationSelect(suggestion);
          } catch (error) {
            console.error('Error getting location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-9 ${className}`}
        />
      </div>
      {useCurrentLocation && (
        <Button
          type="button"
          variant="outline"
          onClick={handleCurrentLocation}
        >
          Current
        </Button>
      )}
    </div>
  );
};

export default LocationInput;