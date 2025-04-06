
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  ArrowUpRight,
  FileText,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  reporter: string;
  reporterPhone: string;
  reporterId: string;
  date: string;
  time: string;
  status: "pending" | "verified" | "rejected" | "escalated";
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  mediaEvidence: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  aiVerified: boolean;
}

const incidents: Incident[] = [
  {
    id: "INC-5723",
    title: "Armed Robbery",
    description: "Two masked men robbed a jewelry store with handguns. Stolen items worth approximately ₹25 lakhs.",
    location: "M-Block Market, Greater Kailash-1, New Delhi",
    reporter: "Amit Kumar",
    reporterPhone: "+91 98765 43210",
    reporterId: "RST-U2345",
    date: "2025-04-05",
    time: "14:30",
    status: "verified",
    severity: "critical",
    category: "Violent Crime",
    mediaEvidence: ["/lovable-uploads/e2b55797-81cb-4383-befc-7a99a055060f.png"],
    coordinates: {
      lat: 28.553,
      lng: 77.241,
    },
    aiVerified: true,
  },
  {
    id: "INC-5722",
    title: "Vehicle Theft",
    description: "White Hyundai Creta (DL8CAF3291) stolen from the parking lot between 3-5 PM.",
    location: "Sector 18, Noida",
    reporter: "Pooja Sharma",
    reporterPhone: "+91 87654 32109",
    reporterId: "RST-U1456",
    date: "2025-04-05",
    time: "17:15",
    status: "pending",
    severity: "medium",
    category: "Theft",
    mediaEvidence: ["/lovable-uploads/e2b55797-81cb-4383-befc-7a99a055060f.png"],
    coordinates: {
      lat: 28.57,
      lng: 77.32,
    },
    aiVerified: true,
  },
  {
    id: "INC-5721",
    title: "Suspicious Activity",
    description: "Person in black hoodie taking photos of building entrance and security cameras.",
    location: "Connaught Place, New Delhi",
    reporter: "Rajesh Singh",
    reporterPhone: "+91 76543 21098",
    reporterId: "RST-U4567",
    date: "2025-04-05",
    time: "12:10",
    status: "pending",
    severity: "low",
    category: "Suspicious Activity",
    mediaEvidence: [],
    coordinates: {
      lat: 28.63,
      lng: 77.22,
    },
    aiVerified: false,
  },
  {
    id: "INC-5720",
    title: "Shop Vandalism",
    description: "Group of teenagers broke shop windows and spray painted graffiti on three shops.",
    location: "Sarojini Nagar Market, New Delhi",
    reporter: "Meera Patel",
    reporterPhone: "+91 65432 10987",
    reporterId: "RST-U5678",
    date: "2025-04-05",
    time: "10:45",
    status: "escalated",
    severity: "medium",
    category: "Vandalism",
    mediaEvidence: ["/lovable-uploads/e2b55797-81cb-4383-befc-7a99a055060f.png"],
    coordinates: {
      lat: 28.577,
      lng: 77.197,
    },
    aiVerified: true,
  },
  {
    id: "INC-5719",
    title: "Fake SOS Call",
    description: "SOS alert triggered but no emergency found at location. User claims accidental trigger.",
    location: "South Extension, New Delhi",
    reporter: "System",
    reporterPhone: "-",
    reporterId: "RST-SYSTEM",
    date: "2025-04-05",
    time: "09:20",
    status: "rejected",
    severity: "low",
    category: "False Report",
    mediaEvidence: [],
    coordinates: {
      lat: 28.57,
      lng: 77.22,
    },
    aiVerified: true,
  },
];

const IncidentManagement: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleAction = (action: string, incident: Incident) => {
    toast({
      title: `Incident ${action}`,
      description: `Incident ${incident.id} has been ${action.toLowerCase()}.`
    });
  };

  const showIncidentDetail = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailDialog(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="mr-1 h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="mr-1 h-4 w-4 text-yellow-600" />;
      case 'escalated':
        return <ArrowUpRight className="mr-1 h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <X className="mr-1 h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="mr-1 h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-500";
      case 'high':
        return "bg-orange-500";
      case 'medium':
        return "bg-yellow-500";
      case 'low':
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
        <p className="text-muted-foreground">
          View and manage all reported incidents
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>All Incidents</CardTitle>
            <CardDescription>
              View and manage all reported crime incidents
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="Search incidents" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>Add New</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow 
                  key={incident.id} 
                  className="cursor-pointer"
                  onClick={() => showIncidentDetail(incident)}
                >
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{incident.title}</div>
                      <div className="text-xs text-muted-foreground">{incident.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(incident.date).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-muted-foreground">{incident.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        incident.status === "verified" ? "border-green-200 bg-green-50 text-green-700" :
                        incident.status === "pending" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                        incident.status === "rejected" ? "border-red-200 bg-red-50 text-red-700" :
                        "border-blue-200 bg-blue-50 text-blue-700"
                      }
                    >
                      <span className="flex items-center">
                        {getStatusIcon(incident.status)}
                        <span className="capitalize">{incident.status}</span>
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                      <span className="capitalize">{incident.severity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleAction("Verified", incident);
                        }}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleAction("Rejected", incident);
                        }}>
                          <X className="mr-2 h-4 w-4 text-red-600" /> Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleAction("Escalated", incident);
                        }}>
                          <ArrowUpRight className="mr-2 h-4 w-4 text-blue-600" /> Escalate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedIncident && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>Incident {selectedIncident.id}</span>
                <Badge 
                  variant="outline" 
                  className={
                    selectedIncident.status === "verified" ? "border-green-200 bg-green-50 text-green-700" :
                    selectedIncident.status === "pending" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                    selectedIncident.status === "rejected" ? "border-red-200 bg-red-50 text-red-700" :
                    "border-blue-200 bg-blue-50 text-blue-700"
                  }
                >
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedIncident.status)}
                    <span className="capitalize">{selectedIncident.status}</span>
                  </span>
                </Badge>
              </DialogTitle>
              <DialogDescription>
                <div className="text-base font-medium mt-1">{selectedIncident.title}</div>
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground flex items-center">
                    <FileText className="mr-2 h-4 w-4" /> Description
                  </h3>
                  <p>{selectedIncident.description}</p>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> Location
                  </h3>
                  <p>{selectedIncident.location}</p>
                  <div className="mt-2 h-32 w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                    Map view would be shown here
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground flex items-center">
                    <User className="mr-2 h-4 w-4" /> Reporter Information
                  </h3>
                  <div className="text-sm">
                    <div><span className="font-medium">Name:</span> {selectedIncident.reporter}</div>
                    <div><span className="font-medium">Phone:</span> {selectedIncident.reporterPhone}</div>
                    <div><span className="font-medium">ID:</span> {selectedIncident.reporterId}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4" /> Date & Time
                  </h3>
                  <div className="text-sm">
                    <div>Date: {new Date(selectedIncident.date).toLocaleDateString('en-IN')}</div>
                    <div>Time: {selectedIncident.time}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Media Evidence</h3>
                  {selectedIncident.mediaEvidence.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedIncident.mediaEvidence.map((media, index) => (
                        <img 
                          key={index}
                          src={media}
                          alt="Evidence"
                          className="aspect-video w-full rounded-md object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No media evidence available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border p-2">
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div>{selectedIncident.category}</div>
                    </div>
                    <div className="rounded-md border p-2">
                      <div className="text-xs text-muted-foreground">Severity</div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getSeverityColor(selectedIncident.severity)}`}></div>
                        <span className="capitalize">{selectedIncident.severity}</span>
                      </div>
                    </div>
                    <div className="rounded-md border p-2">
                      <div className="text-xs text-muted-foreground">AI Verification</div>
                      <div>{selectedIncident.aiVerified ? 'Verified' : 'Unverified'}</div>
                    </div>
                    <div className="rounded-md border p-2">
                      <div className="text-xs text-muted-foreground">Coordinates</div>
                      <div>{selectedIncident.coordinates.lat}, {selectedIncident.coordinates.lng}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleAction("Rejected", selectedIncident);
                    setShowDetailDialog(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => {
                    handleAction("Escalated", selectedIncident);
                    setShowDetailDialog(false);
                  }}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" /> Escalate
                </Button>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleAction("Verified", selectedIncident);
                    setShowDetailDialog(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Verify
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IncidentManagement;
