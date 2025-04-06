
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  ChevronDown, 
  Filter, 
  Layers, 
  MapPin, 
  RotateCcw,
  Settings, 
  Share2, 
  Siren 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const LiveTracking: React.FC = () => {
  const [mapViewMode, setMapViewMode] = useState("standard");
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [mapTokenInput, setMapTokenInput] = useState("");
  
  const handleAlertClick = (id: string) => {
    toast({
      title: "Responding to Alert",
      description: `Dispatching response team to incident #${id}`
    });
  };
  
  const enableMap = () => {
    setIsMapVisible(true);
    toast({
      title: "Map Activated",
      description: "The live tracking map has been activated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Crime Tracking</h1>
          <p className="text-muted-foreground">
            Real-time incident monitoring and response management
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ description: "Map refreshed with latest data" })}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Incidents</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="filter-critical" defaultChecked />
                    <Label htmlFor="filter-critical">Critical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="filter-high" defaultChecked />
                    <Label htmlFor="filter-high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="filter-medium" defaultChecked />
                    <Label htmlFor="filter-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="filter-low" defaultChecked />
                    <Label htmlFor="filter-low">Low</Label>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ description: "Filters applied to map view" })}>
                Apply Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Layers className="mr-2 h-4 w-4" />
                Layers
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Map Layers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="layer-heatmap" defaultChecked />
                    <Label htmlFor="layer-heatmap">Crime Heatmap</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="layer-incidents" defaultChecked />
                    <Label htmlFor="layer-incidents">Incident Markers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="layer-police" defaultChecked />
                    <Label htmlFor="layer-police">Police Stations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="layer-sos" defaultChecked />
                    <Label htmlFor="layer-sos">SOS Alerts</Label>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Map Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="map-view">Map View</Label>
                    <select 
                      id="map-view" 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      value={mapViewMode}
                      onChange={(e) => setMapViewMode(e.target.value)}
                    >
                      <option value="standard">Standard</option>
                      <option value="satellite">Satellite</option>
                      <option value="dark">Dark Mode</option>
                      <option value="traffic">Traffic</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="update-frequency">Update Frequency</Label>
                    <select 
                      id="update-frequency" 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      defaultValue="30"
                    >
                      <option value="10">10 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-center" defaultChecked />
                    <Label htmlFor="auto-center">Auto-center on new alerts</Label>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ description: "Map settings applied successfully" })}>
                Apply Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="h-full min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Real-time Incident Map</CardTitle>
                <CardDescription>Live geographical view of all ongoing incidents</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Map
                </Button>
                <Button variant="destructive" size="sm">
                  <Siren className="mr-2 h-4 w-4" />
                  <span>SOS Alerts</span>
                  <Badge className="ml-1 bg-white text-destructive">3</Badge>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isMapVisible ? (
                <div className="relative h-[500px] rounded-md border bg-muted/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for actual map */}
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Interactive map would render here with Mapbox integration</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Button size="sm" variant="secondary">
                      <MapPin className="mr-2 h-4 w-4" />
                      Center Map
                    </Button>
                  </div>
                  <div className="absolute left-2 top-2">
                    <div className="flex space-x-2">
                      <div className="rounded-md bg-red-500/90 px-2 py-1 text-xs font-medium text-white">
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                          <span>Critical: 5</span>
                        </div>
                      </div>
                      <div className="rounded-md bg-yellow-500/90 px-2 py-1 text-xs font-medium text-white">
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                          <span>Moderate: 12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                    Map View: {mapViewMode.charAt(0).toUpperCase() + mapViewMode.slice(1)}
                  </div>
                </div>
              ) : (
                <div className="flex h-[500px] flex-col items-center justify-center rounded-md border bg-muted/30 p-4">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Enter Mapbox API Token</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    To display the interactive map, you need to provide a Mapbox API token.
                  </p>
                  <div className="mt-4 w-full max-w-md space-y-4">
                    <Input
                      type="text"
                      value={mapTokenInput}
                      onChange={(e) => setMapTokenInput(e.target.value)}
                      placeholder="Enter your Mapbox token here"
                      className="w-full"
                    />
                    <Button onClick={enableMap} className="w-full" disabled={!mapTokenInput}>
                      Activate Map
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Get your token at{" "}
                    <a href="https://mapbox.com" className="text-primary underline">
                      mapbox.com
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="alerts" className="h-full">
            <TabsList className="w-full">
              <TabsTrigger value="alerts" className="flex-1">
                SOS Alerts
              </TabsTrigger>
              <TabsTrigger value="incidents" className="flex-1">
                Active Incidents
              </TabsTrigger>
            </TabsList>
            <TabsContent value="alerts" className="h-full space-y-4 pt-4">
              <Alert variant="destructive" className="flex cursor-pointer items-center justify-between" onClick={() => handleAlertClick("SOS-2584")}>
                <div>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>SOS Alert #SOS-2584</AlertTitle>
                  <AlertDescription className="text-xs">
                    Malviya Nagar, 2 mins ago
                  </AlertDescription>
                </div>
                <Button variant="destructive" size="sm">
                  Respond
                </Button>
              </Alert>
              <Alert variant="destructive" className="flex cursor-pointer items-center justify-between" onClick={() => handleAlertClick("SOS-2583")}>
                <div>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>SOS Alert #SOS-2583</AlertTitle>
                  <AlertDescription className="text-xs">
                    Hauz Khas, 15 mins ago
                  </AlertDescription>
                </div>
                <Button variant="destructive" size="sm">
                  Respond
                </Button>
              </Alert>
              <Alert variant="destructive" className="flex cursor-pointer items-center justify-between" onClick={() => handleAlertClick("SOS-2582")}>
                <div>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>SOS Alert #SOS-2582</AlertTitle>
                  <AlertDescription className="text-xs">
                    Connaught Place, 27 mins ago
                  </AlertDescription>
                </div>
                <Button variant="destructive" size="sm">
                  Respond
                </Button>
              </Alert>

              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Recent Resolved</h4>
                <div className="space-y-2">
                  {["SOS-2581", "SOS-2580", "SOS-2579"].map((id, index) => (
                    <div key={id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <span>Alert #{id}</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Resolved
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="incidents" className="h-full space-y-4 pt-4">
              <div className="space-y-2">
                {[
                  { id: "INC-3421", location: "Lajpat Nagar", type: "Robbery", severity: "High" },
                  { id: "INC-3420", location: "Vasant Kunj", type: "Assault", severity: "High" },
                  { id: "INC-3419", location: "Saket", type: "Theft", severity: "Medium" },
                  { id: "INC-3418", location: "Rohini", type: "Vandalism", severity: "Medium" },
                  { id: "INC-3417", location: "Dwarka", type: "Public Disturbance", severity: "Low" },
                  { id: "INC-3416", location: "Janakpuri", type: "Theft", severity: "Medium" },
                ].map((incident) => (
                  <div 
                    key={incident.id} 
                    className="flex cursor-pointer items-center justify-between rounded-md border p-3 hover:bg-accent"
                    onClick={() => toast({ title: `Incident ${incident.id}`, description: `Viewing details for ${incident.type} in ${incident.location}` })}
                  >
                    <div>
                      <div className="font-medium">{incident.id}: {incident.type}</div>
                      <div className="text-xs text-muted-foreground">{incident.location}</div>
                    </div>
                    <Badge
                      className={
                        incident.severity === "High"
                          ? "bg-red-500/90"
                          : incident.severity === "Medium"
                          ? "bg-yellow-500/90"
                          : "bg-green-500/90"
                      }
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Response Teams</CardTitle>
          <CardDescription>Currently active teams and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Team ID</th>
                  <th className="px-4 py-2 text-left font-medium">Location</th>
                  <th className="px-4 py-2 text-left font-medium">Responding To</th>
                  <th className="px-4 py-2 text-left font-medium">Team Members</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">ETA</th>
                  <th className="px-4 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "RT-001", location: "Malviya Nagar", incident: "SOS-2584", members: 4, status: "En Route", eta: "2 min" },
                  { id: "RT-002", location: "Hauz Khas", incident: "SOS-2583", members: 3, status: "Arrived", eta: "0 min" },
                  { id: "RT-003", location: "Connaught Place", incident: "SOS-2582", members: 5, status: "En Route", eta: "8 min" },
                  { id: "RT-004", location: "Lajpat Nagar", incident: "INC-3421", members: 3, status: "On Scene", eta: "0 min" },
                ].map((team) => (
                  <tr key={team.id} className="border-b">
                    <td className="px-4 py-2">{team.id}</td>
                    <td className="px-4 py-2">{team.location}</td>
                    <td className="px-4 py-2">{team.incident}</td>
                    <td className="px-4 py-2">{team.members} officers</td>
                    <td className="px-4 py-2">
                      <Badge
                        variant="outline"
                        className={
                          team.status === "En Route"
                            ? "border-blue-500 bg-blue-500/10 text-blue-500"
                            : team.status === "Arrived" || team.status === "On Scene"
                            ? "border-green-500 bg-green-500/10 text-green-500"
                            : "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                        }
                      >
                        {team.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{team.eta}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" variant="outline" onClick={() => toast({ description: `Contacting team ${team.id}` })}>
                        Contact
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-muted-foreground">4 active teams deployed</span>
            <Button variant="outline" size="sm" onClick={() => toast({ description: "Dispatching additional response team" })}>
              Dispatch New Team
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LiveTracking;
