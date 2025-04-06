
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle, MapPin } from "lucide-react";

const hotspotData = [
  {
    id: 1,
    location: "Connaught Place",
    incidents: 47,
    crimeTypes: ["Theft", "Pickpocketing"],
    riskLevel: "High",
  },
  {
    id: 2,
    location: "Karol Bagh Market",
    incidents: 38,
    crimeTypes: ["Theft", "Mobile Snatching"],
    riskLevel: "High",
  },
  {
    id: 3,
    location: "Lajpat Nagar Metro Station",
    incidents: 35,
    crimeTypes: ["Pickpocketing", "Fraud"],
    riskLevel: "High",
  },
  {
    id: 4,
    location: "Rajouri Garden",
    incidents: 28,
    crimeTypes: ["Vehicle Theft", "Robbery"],
    riskLevel: "Medium",
  },
  {
    id: 5,
    location: "Greater Kailash Market",
    incidents: 24,
    crimeTypes: ["Theft", "Mobile Snatching"],
    riskLevel: "Medium",
  },
  {
    id: 6,
    location: "Chandni Chowk",
    incidents: 23,
    crimeTypes: ["Pickpocketing", "Theft"],
    riskLevel: "Medium",
  },
  {
    id: 7,
    location: "Nehru Place",
    incidents: 18,
    crimeTypes: ["Fraud", "Theft"],
    riskLevel: "Medium",
  },
];

const crimeByTypeData = [
  { name: "Theft", value: 82 },
  { name: "Pickpocketing", value: 64 },
  { name: "Mobile Snatching", value: 43 },
  { name: "Vehicle Theft", value: 31 },
  { name: "Robbery", value: 28 },
  { name: "Fraud", value: 25 },
];

const CrimeHotspots: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Hotspots</h1>
        <p className="text-muted-foreground">
          High-risk areas with recurring incident patterns
        </p>
      </div>

      <Card className="border-raksha-warning border-l-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-raksha-warning" />
            <CardTitle>Attention Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            There are <strong>3 high-risk areas</strong> that require increased patrolling and surveillance.
            Consider deploying additional personnel to these locations.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="map" className="w-full">
        <TabsList>
          <TabsTrigger value="map" className="gap-2">
            <MapPin className="h-4 w-4" /> Map View
          </TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotspot Map</CardTitle>
              <CardDescription>
                Geographical visualization of high-incident areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Interactive crime hotspot map would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotspot Locations</CardTitle>
              <CardDescription>
                Areas with high concentration of reported incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Incident Count</TableHead>
                    <TableHead>Common Crime Types</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotspotData.map((hotspot) => (
                    <TableRow key={hotspot.id}>
                      <TableCell className="font-medium">{hotspot.location}</TableCell>
                      <TableCell>{hotspot.incidents}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hotspot.crimeTypes.map((type, index) => (
                            <Badge key={index} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            hotspot.riskLevel === "High"
                              ? "bg-red-500"
                              : hotspot.riskLevel === "Medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }
                        >
                          {hotspot.riskLevel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crime Type Analysis</CardTitle>
              <CardDescription>
                Breakdown of crime types in hotspot areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crimeByTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Incidents" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrimeHotspots;
