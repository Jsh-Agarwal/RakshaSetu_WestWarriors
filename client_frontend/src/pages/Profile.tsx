import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  Settings,
  UserCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Save,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample reported incidents
const reportedIncidents = [
  { id: 1, type: 'Theft', location: 'Central Market', date: '12 May 2023', status: 'Verified' },
  { id: 2, type: 'Accident', location: 'Highway Junction', date: '5 Apr 2023', status: 'Under Investigation' },
  { id: 3, type: 'Suspicious', location: 'Residential Block C', date: '28 Feb 2023', status: 'Resolved' },
];

const Profile: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    address: "123 Main St, New Delhi",
    aadhaar: "XXXX-XXXX-1234" // Added Aadhaar field
  });
  
  const [editData, setEditData] = useState({ ...userData });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState("Detecting location...");
  
  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use reverse geocoding to get readable address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setCurrentLocation(data.display_name.split(',')[0] || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } catch (error) {
            setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location access denied");
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  }, []);
  
  const handleLogout = () => {
    toast.info("Logout functionality would be implemented in a full app");
  };
  
  const handleEditSave = () => {
    if (!editData.aadhaar || editData.aadhaar.trim() === '') {
      toast.error("Aadhaar number is mandatory");
      return;
    }
    
    setUserData({ ...editData });
    setIsDialogOpen(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Profile" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        {/* Profile Header */}
        <section className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-raksha-secondary/10 flex items-center justify-center mb-3">
            <UserCircle size={50} className="text-raksha-secondary" />
          </div>
          <h1 className="text-xl font-bold text-raksha-secondary">{userData.name}</h1>
          <p className="text-gray-600 text-sm">{currentLocation}</p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <div className="relative">
                    <Home size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    Aadhaar Number
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Required)</span>
                  </label>
                  <div className="relative">
                    <FileCheck size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.aadhaar}
                      onChange={(e) => setEditData({...editData, aadhaar: e.target.value})}
                      className="pl-10"
                      placeholder="XXXX-XXXX-XXXX"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Your Aadhaar number is used to verify your identity</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-raksha-primary" onClick={handleEditSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
        
        {/* User Info */}
        <section className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h2 className="text-md font-semibold mb-3 text-raksha-secondary">Personal Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm">{userData.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm">{userData.address}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileCheck size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Aadhaar Number</p>
                <p className="text-sm">{userData.aadhaar}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Reported Incidents Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h2 className="text-md font-semibold mb-3 text-raksha-secondary">Your Reported Incidents</h2>
          
          {reportedIncidents.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {reportedIncidents.map((incident) => (
                <div key={incident.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="text-raksha-primary mr-2" />
                      <span className="font-medium text-sm">{incident.type}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{incident.location}</p>
                    <p className="text-xs text-gray-500">{incident.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      incident.status === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : incident.status === 'Resolved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm">
              You haven't reported any incidents yet
            </p>
          )}
        </section>
        
        {/* Safety Score */}
        <section className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-semibold text-raksha-secondary">Trust Score</h2>
            <div className="text-xl font-bold text-raksha-secondary">92</div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-raksha-secondary h-2 rounded-full"
              style={{ width: '92%' }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your trust score reflects your community contributions and report accuracy.
          </p>
        </section>
        
        {/* Settings List */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            <div className="flex items-center px-4 py-3">
              <ShieldCheck size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Privacy & Security</span>
            </div>
            <div className="flex items-center px-4 py-3">
              <HelpCircle size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Help & Support</span>
            </div>
            <div className="flex items-center px-4 py-3">
              <BookOpen size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Terms & Policies</span>
            </div>
            <div className="flex items-center px-4 py-3">
              <Settings size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">App Settings</span>
            </div>
          </div>
        </section>
        
        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full border-raksha-primary text-raksha-primary"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
        
        {/* Incident Details Dialog */}
        {selectedIncident && (
          <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Incident Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Type</h3>
                  <p>{selectedIncident.type}</p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{selectedIncident.location}</p>
                </div>
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p>{selectedIncident.date}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedIncident.status === 'Verified' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedIncident.status === 'Resolved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedIncident.status}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <p className="text-center text-xs text-gray-500 mt-6">
          RakshaSetu v1.0.0
        </p>
      </main>
    </div>
  );
};

export default Profile;
