
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ambulance, Bell, FileText, MapPin, PhoneCall, Shield, Siren } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample data for SOS alerts
const activeAlerts = [
  {
    id: "SOS-482",
    location: "Sector 18, Noida",
    coordinates: "28.5707° N, 77.3219° E",
    triggerSource: "Manual SOS",
    timestamp: "2025-04-05 10:32:15",
    status: "active",
    responseTeams: ["Police"]
  },
  {
    id: "SOS-481",
    location: "Connaught Place, New Delhi",
    coordinates: "28.6315° N, 77.2167° E",
    triggerSource: "AI Detection (Audio)",
    timestamp: "2025-04-05 10:18:42",
    status: "active",
    responseTeams: ["Police", "Ambulance"]
  },
  {
    id: "SOS-480",
    location: "MG Road, Gurugram",
    coordinates: "28.4751° N, 77.0766° E",
    triggerSource: "Manual SOS",
    timestamp: "2025-04-05 09:57:21",
    status: "active",
    responseTeams: ["Police"]
  },
];

const pastAlerts = [
  {
    id: "SOS-479",
    location: "Vasant Kunj, New Delhi",
    coordinates: "28.5414° N, 77.1571° E",
    triggerSource: "Voice Command",
    timestamp: "2025-04-04 22:05:38",
    status: "resolved",
    responseTeams: ["Police", "Ambulance"]
  },
  {
    id: "SOS-478",
    location: "Saket, New Delhi",
    coordinates: "28.5285° N, 77.2127° E",
    triggerSource: "Manual SOS",
    timestamp: "2025-04-04 19:43:12",
    status: "resolved",
    responseTeams: ["Police"]
  },
  {
    id: "SOS-477",
    location: "Greater Kailash, New Delhi",
    coordinates: "28.5452° N, 77.2432° E",
    triggerSource: "AI Detection (Video)",
    timestamp: "2025-04-04 15:28:56",
    status: "resolved",
    responseTeams: ["Police", "Fire"]
  }
];

const AlertsAndSOS: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [showMapToken, setShowMapToken] = useState(true);
  const [mapToken, setMapToken] = useState("");

  const handleCall = (alertId: string) => {
    toast({
      title: "Calling Response Team",
      description: `Initiating call for alert ${alertId}`
    });
  };

  const handleTrack = (alertId: string) => {
    toast({
      title: "Tracking Alert",
      description: `Live tracking initiated for alert ${alertId}`
    });
    setActiveTab("map");
  };

  const handleViewReport = (alertId: string) => {
    toast({
      title: "Report Accessed",
      description: `Viewing detailed report for ${alertId}`
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "The SOS alerts report has been generated and is ready for download"
    });
  };

  const handleMapActivation = () => {
    if (!mapToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Mapbox token",
        variant: "destructive"
      });
      return;
    }
    
    setShowMapToken(false);
    toast({
      title: "Map Activated",
      description: "Interactive map has been activated successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & SOS</h1>
          <p className="text-muted-foreground">
            Manage emergency alerts and SOS signals
          </p>
        </div>
        <Button onClick={handleGenerateReport} className="flex gap-2">
          <FileText className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-red-500">{activeAlerts.length}</div>
              <Badge className="bg-red-500">LIVE</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Response Teams Deployed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2 min</div>
          </CardContent>
        </Card>
      </div>

      <Tabs 
        defaultValue="active" 
        className="w-full" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="active" className="gap-2">
            <Siren className="h-4 w-4 text-red-500" /> Active Alerts
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Bell className="h-4 w-4" /> Past Alerts
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <MapPin className="h-4 w-4" /> Map View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active SOS Alerts</CardTitle>
              <CardDescription>
                Currently active emergency situations requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SOS ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="hidden md:table-cell">Trigger Source</TableHead>
                    <TableHead className="hidden sm:table-cell">Timestamp</TableHead>
                    <TableHead>Response Teams</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{alert.location}</p>
                          <p className="text-xs text-muted-foreground">{alert.coordinates}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{alert.triggerSource}</TableCell>
                      <TableCell className="hidden sm:table-cell">{alert.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {alert.responseTeams.includes("Police") && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              <Shield className="mr-1 h-3 w-3" /> Police
                            </Badge>
                          )}
                          {alert.responseTeams.includes("Ambulance") && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              <Ambulance className="mr-1 h-3 w-3" /> Medical
                            </Badge>
                          )}
                          {alert.responseTeams.includes("Fire") && (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              <Siren className="mr-1 h-3 w-3" /> Fire
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCall(alert.id)}
                          >
                            <PhoneCall className="mr-1 h-4 w-4" /> Call
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleTrack(alert.id)}
                          >
                            <MapPin className="mr-1 h-4 w-4" /> Track
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Past SOS Alerts</CardTitle>
              <CardDescription>
                Historical emergency situations that have been resolved
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SOS ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="hidden md:table-cell">Trigger Source</TableHead>
                    <TableHead className="hidden sm:table-cell">Timestamp</TableHead>
                    <TableHead>Response Teams</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{alert.location}</p>
                          <p className="text-xs text-muted-foreground">{alert.coordinates}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{alert.triggerSource}</TableCell>
                      <TableCell className="hidden sm:table-cell">{alert.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {alert.responseTeams.includes("Police") && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              <Shield className="mr-1 h-3 w-3" /> Police
                            </Badge>
                          )}
                          {alert.responseTeams.includes("Ambulance") && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              <Ambulance className="mr-1 h-3 w-3" /> Medical
                            </Badge>
                          )}
                          {alert.responseTeams.includes("Fire") && (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              <Siren className="mr-1 h-3 w-3" /> Fire
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewReport(alert.id)}
                        >
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SOS Map View</CardTitle>
              <CardDescription>
                Geographic visualization of active alerts and response teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showMapToken ? (
                <div className="flex flex-col items-center justify-center rounded-md bg-muted p-8">
                  <MapPin className="mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">Enter your Mapbox API token</h3>
                  <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                    To display the interactive map with SOS locations, please enter your Mapbox API token. 
                    You can get one from <a href="https://mapbox.com" className="text-blue-500 underline">mapbox.com</a>
                  </p>
                  <div className="w-full max-w-md space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter your Mapbox token" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={mapToken}
                        onChange={(e) => setMapToken(e.target.value)}
                      />
                      <Button onClick={handleMapActivation}>Activate</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
                  <div className="text-center">
                    <MapPin className="mx-auto h-16 w-16 text-primary/50" />
                    <p className="mt-4 text-muted-foreground">
                      Interactive map with SOS locations would be displayed here
                    </p>
                    <div className="mt-6 flex justify-center gap-2">
                      <Button variant="outline">Show Heatmap</Button>
                      <Button>View Response Routes</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsAndSOS;
