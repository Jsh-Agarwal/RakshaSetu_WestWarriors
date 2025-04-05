import React, { useState } from 'react';
import { Input } from './ui/input';
import { MapPin } from 'lucide-react';

interface LocationSuggestion {
  id: string;
  description: string;
  placeId: string;
}

interface LocationSearchInputProps {
  placeholder: string;
  onLocationSelect: (location: string) => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ placeholder, onLocationSelect }) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (value: string) => {
    setSearchText(value);
    if (value.length > 2) {
      // In a real implementation, this would call the Google Places API
      // For now, showing mock suggestions
      const mockSuggestions = [
        { id: '1', description: `${value} - Location 1`, placeId: 'place1' },
        { id: '2', description: `${value} - Location 2`, placeId: 'place2' },
        { id: '3', description: `${value} - Location 3`, placeId: 'place3' },
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          value={searchText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                setSearchText(suggestion.description);
                onLocationSelect(suggestion.description);
                setShowSuggestions(false);
              }}
            >
              <MapPin size={14} className="inline mr-2 text-gray-500" />
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;