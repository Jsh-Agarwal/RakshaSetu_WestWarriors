import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Calendar, AlertTriangle } from 'lucide-react';

interface IncidentDetailsProps {
  incident: {
    id: number;
    type: string;
    location: string;
    date: string;
    status: string;
    description?: string;
    evidence?: string[];
  };
  open: boolean;
  onClose: () => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Incident Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-raksha-primary mt-0.5" />
            <div>
              <h4 className="font-semibold">{incident.type}</h4>
              <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                incident.status === 'Verified' 
                  ? 'bg-green-100 text-green-800' 
                  : incident.status === 'Resolved'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {incident.status}
              </span>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-gray-600">{incident.location}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Date & Time</p>
              <p className="text-sm text-gray-600">{incident.date}</p>
            </div>
          </div>
          
          {incident.description && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-2">Description</p>
              <p className="text-sm text-gray-600">{incident.description}</p>
            </div>
          )}
          
          {incident.evidence && incident.evidence.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-2">Evidence</p>
              <div className="grid grid-cols-2 gap-2">
                {incident.evidence.map((item, index) => (
                  <img 
                    key={index}
                    src={item}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetails;