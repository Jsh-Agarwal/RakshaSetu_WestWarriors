import React, { useState, useEffect, useRef } from 'react';
import AppHeader from '@/components/AppHeader';
import EmergencySOS from '@/components/EmergencySOS';
import SafetyScore from '@/components/SafetyScore';
import SafetyTips from '@/components/SafetyTips';
import EmergencyContacts from '@/components/EmergencyContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, UserCircle, Bell, Route, Shield, AlertCircle, MapPin, Check, Search, Phone, Building2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter 
} from '@/components/ui/dialog';
import { api } from '@/services/api';

// Sample emergency contacts
const initialContacts = [
  { id: '1', name: 'Emergency Contact 1', phone: '+1234567890' }
];

// Sample shared locations
const sharedLocations = [
  { id: '1', name: 'Friend 1', location: 'Lat: 28.6139, Long: 77.2090', time: '5 mins ago' },
  { id: '2', name: 'Friend 2', location: 'Lat: 28.5355, Long: 77.2910', time: '15 mins ago' }
];

// Add new interfaces
interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SafetyAnalysis {
  safe: boolean;
  reason?: string;
  alternateRoute?: string;
  mapImageBase64?: string;
  pathGeoJSON?: any;
}

const Safety: React.FC = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [editingContact, setEditingContact] = useState<{ id: string, name: string, phone: string } | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [safetyAnalysis, setSafetyAnalysis] = useState<SafetyAnalysis | null>(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [isSearchingContacts, setIsSearchingContacts] = useState(false);
  const [startLocationSuggestions, setStartLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  const [nearbyPoliceStations, setNearbyPoliceStations] = useState<any[]>([]);
  const [markedLocations, setMarkedLocations] = useState<any[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Add refs for click outside handling
  const startSuggestionsRef = useRef<HTMLDivElement>(null);
  const destSuggestionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startSuggestionsRef.current && !startSuggestionsRef.current.contains(event.target as Node)) {
        setShowStartSuggestions(false);
      }
      if (destSuggestionsRef.current && !destSuggestionsRef.current.contains(event.target as Node)) {
        setShowDestSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add function to fetch location suggestions
  const fetchLocationSuggestions = async (query: string, isStart: boolean) => {
    if (query.length < 3) {
      isStart ? setStartLocationSuggestions([]) : setDestinationSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      const suggestions: LocationSuggestion[] = data.map((item: any) => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon
      }));

      if (isStart) {
        setStartLocationSuggestions(suggestions);
        setShowStartSuggestions(true);
      } else {
        setDestinationSuggestions(suggestions);
        setShowDestSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Could not fetch location suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Add debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Create debounced search functions
  const debouncedStartSearch = debounce(
    (query: string) => fetchLocationSuggestions(query, true),
    300
  );

  const debouncedDestSearch = debounce(
    (query: string) => fetchLocationSuggestions(query, false),
    300
  );

  // Add function to fetch emergency services
  const fetchEmergencyServices = async (latitude: number, longitude: number) => {
    try {
      const [hospitals, policeStations] = await Promise.all([
        api.getNearbyHospitals({ lat: latitude, lng: longitude }),
        api.getNearbyPoliceStations({ lat: latitude, lng: longitude })
      ]);
      
      setNearbyHospitals(hospitals);
      setNearbyPoliceStations(policeStations);
    } catch (error) {
      console.error("Error fetching emergency services:", error);
      toast.error("Could not fetch nearby emergency services");
    }
  };

  // Add function to fetch marked locations
  const fetchMarkedLocations = async (latitude: number, longitude: number) => {
    try {
      const locations = await api.getMarkedLocations({ lat: latitude, lng: longitude });
      setMarkedLocations(locations);
    } catch (error) {
      console.error("Error fetching marked locations:", error);
      toast.error("Could not fetch marked locations");
    }
  };

  // Update handleShareLocation to also fetch emergency services and marked locations
  const handleShareLocation = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact to share your location with");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Sync location with backend
            await api.syncLocation({
              clientId: "user_id", // Replace with actual user ID
              location: {
                lat: latitude,
                lng: longitude
              }
            });

            // Get readable address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setCurrentLocation(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            
            // Mark location for safety tracking
            await api.markLocation({ lat: latitude, lng: longitude });

            // Fetch emergency services and marked locations
            await Promise.all([
              fetchEmergencyServices(latitude, longitude),
              fetchMarkedLocations(latitude, longitude)
            ]);

            toast.success(`Location shared with ${selectedContacts.length} contacts`);
          } catch (error) {
            console.error("Error sharing location:", error);
            toast.error("Could not share location. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please check permissions.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please enter both name and phone number");
      return;
    }

    const newId = `${contacts.length + 1}`;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ name: '', phone: '' });
    toast.success("Contact added successfully!");
    
    // Simulate notification being sent to the contact
    toast.info(`Notification sent to ${newContact.name} for emergency contact approval`);
  };

  const handleUpdateContact = () => {
    if (!editingContact) return;
    
    if (!editingContact.name || !editingContact.phone) {
      toast.error("Please enter both name and phone number");
      return;
    }

    const updatedContacts = contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    );
    
    setContacts(updatedContacts);
    setEditingContact(null);
    toast.success("Contact updated successfully!");
  };

  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleCheckRoute = async () => {
    if (!startLocation || !destination) {
      toast.error("Please enter both start and destination locations");
      return;
    }

    setIsLoadingRoute(true);
    toast.info("Analyzing route safety...");

    try {
      // Get coordinates from the selected locations
      const start = {
        lat: parseFloat(startLocationSuggestions.find(s => s.display_name === startLocation)?.lat || "0"),
        lng: parseFloat(startLocationSuggestions.find(s => s.display_name === startLocation)?.lon || "0")
      };

      const end = {
        lat: parseFloat(destinationSuggestions.find(s => s.display_name === destination)?.lat || "0"),
        lng: parseFloat(destinationSuggestions.find(s => s.display_name === destination)?.lon || "0")
      };

      // Get safest path from API
      const pathData = await api.getSafestPath(start, end);
      
      // Update safety analysis with the response
      setSafetyAnalysis({
        safe: pathData.pathGeoJSON.properties.length_km < 5, // Example safety criteria
        reason: `Route length: ${pathData.pathGeoJSON.properties.length_km.toFixed(2)} km`,
        mapImageBase64: pathData.mapImageBase64,
        pathGeoJSON: pathData.pathGeoJSON
      });

      if (pathData.pathGeoJSON.properties.length_km < 5) {
        toast.success("Route analyzed - Safe to travel");
      } else {
        toast.warning("Caution: Route may have safety concerns. Check the map for details.");
      }
    } catch (error) {
      console.error("Error checking route:", error);
      toast.error("Could not analyze route safety. Please try again.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleSearchContacts = () => {
    setIsSearchingContacts(true);
    
    // Simulate searching in phone contacts
    setTimeout(() => {
      toast.success("3 contacts found from your phone");
      setIsSearchingContacts(false);
      
      // For demo purposes, just add mock contacts
      const mockContacts = [
        { id: `${contacts.length + 1}`, name: 'John Smith', phone: '+91 9876543211' },
        { id: `${contacts.length + 2}`, name: 'Alex Johnson', phone: '+91 9876543222' },
        { id: `${contacts.length + 3}`, name: 'Sarah Wilson', phone: '+91 9876543233' },
      ];
      
      setContacts([...contacts, ...mockContacts]);
    }, 2000);
  };

  // Handle destination input change
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    debouncedDestSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    setDestination(suggestion.display_name);
    setShowDestSuggestions(false);
    // You can store the coordinates for later use
    const coordinates = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    console.log('Selected coordinates:', coordinates);
  };

  const hospitals = [
    { name: 'Civil Hospital', phone: '0261-2240000', location: 'Civil Hospital, Surat' },
    { name: 'New Civil Hospital', phone: '0261-2244444', location: 'New Civil Hospital, Surat' },
    { name: 'SMIMER Hospital', phone: '0261-2463333', location: 'SMIMER Hospital, Surat' },
    { name: 'Government Hospital', phone: '0261-2470000', location: 'Government Hospital, Surat' }
  ];

  const policeStations = [
    { name: 'Surat Police Control Room', phone: '100', location: 'Surat Police Headquarters' },
    { name: 'Athwa Police Station', phone: '0261-2471000', location: 'Athwa Police Station, Surat' },
    { name: 'Katargam Police Station', phone: '0261-2481000', location: 'Katargam Police Station, Surat' },
    { name: 'Adajan Police Station', phone: '0261-2491000', location: 'Adajan Police Station, Surat' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Safety" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        {/* Emergency SOS Button */}
        <section className="mb-6">
          <EmergencySOS />
        </section>
        
        {/* Safety Score */}
        <SafetyScore score={85} className="mb-6" />
        
        {/* Emergency Contacts */}
        <section className="mb-6">
          <EmergencyContacts />
        </section>
        
        {/* Share Location */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Share Your Location</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Share your live location with trusted contacts so they can track your journey
            </p>
            
            {currentLocation && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm mb-2">
                  <MapPin size={16} className="text-raksha-primary mr-1" />
                  <span className="font-medium">Your current location:</span>
                </div>
                <p className="text-sm">{currentLocation}</p>
              </div>
            )}
            
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-2">Select contacts to share with:</h3>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`flex items-center justify-between border rounded-md p-2 ${
                      selectedContacts.includes(contact.id) ? 'bg-raksha-primary/10 border-raksha-primary' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectContact(contact.id)}
                  >
                    <div className="flex items-center">
                      <UserCircle size={24} className="text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm block">{contact.name}</span>
                        <span className="text-xs text-gray-500">{contact.phone}</span>
                      </div>
                    </div>
                    {selectedContacts.includes(contact.id) && (
                      <Check size={18} className="text-raksha-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-raksha-secondary hover:bg-raksha-secondary/90 mb-3"
              onClick={handleShareLocation}
            >
              <Share2 size={18} className="mr-2" />
              Share Live Location
            </Button>
            
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium mb-2">Trusted Contacts</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      + Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input 
                          placeholder="Contact name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          placeholder="Phone number"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center"
                          onClick={handleSearchContacts}
                          disabled={isSearchingContacts}
                        >
                          {isSearchingContacts ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-raksha-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Searching...
                            </span>
                          ) : (
                            <span>Search from Phone Contacts</span>
                          )}
                        </Button>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          This will request access to your contacts
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="space-x-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => {
                        handleAddContact();
                      }}>
                        Add Contact
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2 pt-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between border border-gray-100 rounded-md p-2">
                    <div className="flex items-center">
                      <UserCircle size={24} className="text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm">{contact.name}</span>
                        <span className="text-xs text-gray-500 block">{contact.phone}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingContact(contact)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Contact</DialogTitle>
                        </DialogHeader>
                        {editingContact && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name</label>
                              <Input 
                                value={editingContact.name}
                                onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Phone Number</label>
                              <Input 
                                value={editingContact.phone}
                                onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleUpdateContact}>
                            Update Contact
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Shared Locations */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Shared Locations</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Track friends who have shared their location with you
            </p>
            
            {markedLocations.length > 0 ? (
              <div className="space-y-3">
                {markedLocations.map((location) => (
                  <div key={location.id} className="flex justify-between items-center border border-gray-100 rounded-md p-3">
                    <div className="flex items-center">
                      <MapPin size={24} className="text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm font-medium">{location.name || 'Marked Location'}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1" />
                          {`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                        </div>
                        <span className="text-xs text-gray-400">{location.timestamp || 'Recently marked'}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => window.location.href=`/map?lat=${location.lat}&lng=${location.lng}`}
                    >
                      View Map
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No marked locations</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Emergency Services
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Nearby Emergency Services</h2>
          <div className="space-y-4">
            {/* Hospitals */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-md font-medium mb-3">Hospitals</h3>
              {nearbyHospitals.length > 0 ? (
                <div className="space-y-3">
                  {nearbyHospitals.map((hospital) => (
                    <div key={hospital.id} className="flex justify-between items-center border border-gray-100 rounded-md p-3">
                      <div className="flex items-center">
                        <div className="text-red-500 mr-2">🏥</div>
                        <div>
                          <span className="text-sm font-medium">{hospital.name}</span>
                          <div className="text-xs text-gray-500">{hospital.distance} km away</div>
                          <div className="text-xs text-gray-400">{hospital.address}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => window.location.href=`/map?lat=${hospital.lat}&lng=${hospital.lng}`}
                      >
                        Directions
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No nearby hospitals found</p>
                </div>
              )}
            </div> */} 
{/*
            {/* Police Stations */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-md font-medium mb-3">Police Stations</h3>
              {nearbyPoliceStations.length > 0 ? (
                <div className="space-y-3">
                  {nearbyPoliceStations.map((station) => (
                    <div key={station.id} className="flex justify-between items-center border border-gray-100 rounded-md p-3">
                      <div className="flex items-center">
                        <div className="text-blue-500 mr-2">👮</div>
                        <div>
                          <span className="text-sm font-medium">{station.name}</span>
                          <div className="text-xs text-gray-500">{station.distance} km away</div>
                          <div className="text-xs text-gray-400">{station.address}</div>
                        </div> */} 
                      {/* </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => window.location.href=`/map?lat=${station.lat}&lng=${station.lng}`}
                      >
                        Directions
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No nearby police stations found</p>
                </div>
              )}
            </div>
          </div>
        </section> */}
        
        {/* Safe Routes */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Safe Routes</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Check safety of your travel route and get safer alternatives if needed
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="relative">
                <label className="text-sm font-medium">Starting Point</label>
                <div className="flex mt-1">
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Enter starting location"
                      value={startLocation}
                      onChange={(e) => {
                        setStartLocation(e.target.value);
                        debouncedStartSearch(e.target.value);
                      }}
                      onFocus={() => setShowStartSuggestions(true)}
                      className="flex-1"
                    />
                    {/* Starting Point Suggestions */}
                    {showStartSuggestions && startLocationSuggestions.length > 0 && (
                      <div 
                        ref={startSuggestionsRef}
                        className="absolute z-10 w-full bg-white mt-1 rounded-md border border-gray-200 shadow-lg max-h-60 overflow-auto"
                      >
                        {startLocationSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setStartLocation(suggestion.display_name);
                              setShowStartSuggestions(false);
                            }}
                          >
                            <div className="font-medium">{suggestion.display_name.split(',')[0]}</div>
                            <div className="text-xs text-gray-500">{suggestion.display_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            const { latitude, longitude } = position.coords;
                            try {
                              const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                              );
                              const data = await response.json();
                              setStartLocation(data.display_name);
                              toast.success("Current location set as starting point");
                            } catch (error) {
                              setStartLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                              toast.success("Current location coordinates set");
                            }
                          },
                          (error) => {
                            toast.error("Could not get your location");
                          }
                        );
                      }
                    }}
                  >
                    Current
                  </Button>
                </div>
              </div>
              
              <div className="relative mb-4">
                <label className="text-sm font-medium">Destination</label>
                <div className="relative">
                  <Input 
                    placeholder="Enter destination"
                    value={destination}
                    onChange={handleDestinationChange}
                    onFocus={() => setShowDestSuggestions(true)}
                    className="mt-1 pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  
                  {/* Loading indicator */}
                  {isLoadingSuggestions && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-raksha-primary hover:bg-raksha-primary/90 mb-3"
              onClick={handleCheckRoute}
              disabled={isLoadingRoute}
            >
              {isLoadingRoute ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Route...
                </div>
              ) : (
                <>
                  <Route size={18} className="mr-2" />
                  Check Route Safety
                </>
              )}
            </Button>
            
            {safetyAnalysis && (
              <div className={`mt-4 p-3 rounded-lg ${safetyAnalysis.safe ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center mb-2">
                  {safetyAnalysis.safe ? (
                    <Shield size={18} className="text-green-500 mr-2" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-500 mr-2" />
                  )}
                  <span className={`font-medium ${safetyAnalysis.safe ? 'text-green-700' : 'text-amber-700'}`}>
                    {safetyAnalysis.safe ? 'Safe Route' : 'Caution Advised'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">{safetyAnalysis.reason}</p>
                
                {safetyAnalysis.mapImageBase64 && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={`data:image/png;base64,${safetyAnalysis.mapImageBase64}`}
                      alt="Route Map"
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Safety Tips */}
        <SafetyTips />

        {/* Hospitals Section */}
        <section className="mb-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center mb-4">
                <Building2 className="text-red-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold">Hospitals</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.map((hospital, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{hospital.name}</h3>
                      <p className="text-sm text-gray-600">{hospital.location}</p>
                    </div>
                    <a 
                      href={`tel:${hospital.phone}`}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Phone size={16} className="mr-1" />
                      {hospital.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Police Stations Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center mb-4">
                <ShieldCheck className="text-blue-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold">Police Stations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policeStations.map((station, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.location}</p>
                    </div>
                    <a 
                      href={`tel:${station.phone}`}
                      className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Phone size={16} className="mr-1" />
                      {station.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Safety;
