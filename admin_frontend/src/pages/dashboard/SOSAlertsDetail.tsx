
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  MapPin,
  Phone,
  Siren,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SOSAlert {
  id: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  user: {
    name: string;
    id: string;
    phone: string;
    bloodGroup?: string;
  };
  status: "active" | "responding" | "resolved";
  type: "manual" | "auto" | "voice";
  description?: string;
  responders?: string[];
}

const sosAlerts: SOSAlert[] = [
  {
    id: "SOS-2584",
    location: "Malviya Nagar, New Delhi",
    coordinates: {
      lat: 28.5394,
      lng: 77.2205,
    },
    timestamp: "2025-04-05T14:23:00",
    user: {
      name: "Aditya Singh",
      id: "RST-U3245",
      phone: "+91 94527 65432",
      bloodGroup: "O+",
    },
    status: "active",
    type: "manual",
    description: "Armed men outside home. Need immediate help.",
  },
  {
    id: "SOS-2583",
    location: "Hauz Khas, New Delhi",
    coordinates: {
      lat: 28.5494,
      lng: 77.2001,
    },
    timestamp: "2025-04-05T14:08:00",
    user: {
      name: "Priya Sharma",
      id: "RST-U4321",
      phone: "+91 87654 32109",
    },
    status: "responding",
    type: "voice",
    description: "Help! Someone is breaking into my apartment.",
    responders: ["PCR-12", "Ambulance-05"],
  },
  {
    id: "SOS-2582",
    location: "Connaught Place, New Delhi",
    coordinates: {
      lat: 28.6315,
      lng: 77.2167,
    },
    timestamp: "2025-04-05T13:56:00",
    user: {
      name: "Raj Kumar",
      id: "RST-U6789",
      phone: "+91 76543 21098",
      bloodGroup: "B+",
    },
    status: "active",
    type: "auto",
    description: "Fall detected. No response from user.",
  },
  {
    id: "SOS-2581",
    location: "Saket, New Delhi",
    coordinates: {
      lat: 28.5248,
      lng: 77.2158,
    },
    timestamp: "2025-04-05T13:30:00",
    user: {
      name: "Amit Verma",
      id: "RST-U7890",
      phone: "+91 98765 43210",
    },
    status: "resolved",
    type: "manual",
    description: "Street fight escalating with weapons.",
    responders: ["PCR-08", "PCR-15"],
  },
  {
    id: "SOS-2580",
    location: "Vasant Kunj, New Delhi",
    coordinates: {
      lat: 28.5253,
      lng: 77.1560,
    },
    timestamp: "2025-04-05T13:15:00",
    user: {
      name: "Neha Gupta",
      id: "RST-U5678",
      phone: "+91 91234 56789",
      bloodGroup: "A-",
    },
    status: "resolved",
    type: "manual",
    description: "Medical emergency. Need ambulance.",
    responders: ["Ambulance-12"],
  },
];

const SOSAlertsDetail: React.FC = () => {
  const handleRespond = (alertId: string) => {
    toast({
      title: "Responding to Alert",
      description: `Emergency teams dispatched to respond to SOS alert #${alertId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-600 text-white";
      case "responding":
        return "bg-yellow-500 text-white";
      case "resolved":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "manual":
        return <User className="h-4 w-4" />;
      case "auto":
        return <AlertTriangle className="h-4 w-4" />;
      case "voice":
        return <Phone className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Active SOS Alerts</h1>
      </div>
      <p className="text-muted-foreground">
        Emergency alerts requiring immediate attention
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>SOS Alert Map</CardTitle>
            <CardDescription>Geographic distribution of current emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-md bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map would be shown here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Summary</CardTitle>
            <CardDescription>Current SOS statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-red-800">Active Alerts</div>
                  <div className="text-xl font-bold text-red-800">3</div>
                </div>
              </div>
              
              <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-yellow-800">Responding</div>
                  <div className="text-xl font-bold text-yellow-800">1</div>
                </div>
              </div>
              
              <div className="rounded-md border-l-4 border-green-500 bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-green-800">Resolved Today</div>
                  <div className="text-xl font-bold text-green-800">2</div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Avg. Response Time</div>
                  <div className="font-medium">4.2 min</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Common Trigger</div>
                  <div className="font-medium">Manual (60%)</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Hotspot Area</div>
                  <div className="font-medium">Malviya Nagar</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full gap-1">
                  <Download className="h-4 w-4" /> Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight">Active SOS Alerts</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sosAlerts
          .filter((alert) => alert.status !== "resolved")
          .map((alert) => (
            <Card key={alert.id} className="overflow-hidden">
              <div className={`h-2 w-full ${alert.status === "active" ? "bg-red-500" : "bg-yellow-500"}`}></div>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Siren className="h-5 w-5 text-red-500" />
                    {alert.id}
                  </CardTitle>
                  <CardDescription>{alert.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(alert.status)}>
                  {alert.status === "active" ? "Active" : "Responding"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">User</div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{alert.user.name}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{alert.user.id}</div>
                  </div>
                  
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Contact</div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{alert.user.phone}</span>
                    </div>
                    {alert.user.bloodGroup && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Blood Group: {alert.user.bloodGroup}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Location</div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {alert.coordinates.lat}, {alert.coordinates.lng}
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Time</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(alert.timestamp)}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Triggered by: <span className="capitalize">{alert.type}</span>
                      {getTypeIcon(alert.type)}
                    </div>
                  </div>
                </div>
                
                {alert.status === "responding" && alert.responders && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Responders</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {alert.responders.map((responder) => (
                        <Badge key={responder} variant="outline">
                          {responder}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2">
                  {alert.status === "active" ? (
                    <>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button onClick={() => handleRespond(alert.id)} size="sm">
                        Dispatch Team
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight">Recently Resolved Alerts</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sosAlerts
          .filter((alert) => alert.status === "resolved")
          .map((alert) => (
            <Card key={alert.id} className="overflow-hidden">
              <div className="h-2 w-full bg-green-500"></div>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Siren className="h-5 w-5 text-green-500" />
                    {alert.id}
                  </CardTitle>
                  <CardDescription>{alert.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(alert.status)}>Resolved</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">User</div>
                    <div>{alert.user.name}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Location</div>
                    <div>{alert.location}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Time</div>
                    <div>{formatTime(alert.timestamp)}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Responders</div>
                    <div className="flex flex-wrap gap-1">
                      {alert.responders?.map((responder) => (
                        <Badge key={responder} variant="outline">
                          {responder}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default SOSAlertsDetail;
