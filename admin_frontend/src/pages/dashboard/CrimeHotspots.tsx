
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateHotspotItinerary } from "../../utils/reportUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const CrimeHotspots = () => {
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  
  const handleGenerateItinerary = () => {
    const data = generateHotspotItinerary();
    setItinerary(data);
    setItineraryGenerated(true);
    
    toast({
      title: "Weekly Itinerary Generated",
      description: "Police teams have been scheduled for hotspot coverage",
    });
  };
  
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'Very High':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Crime Hotspots</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateItinerary}>Generate Weekly Itinerary</Button>
        </div>
      </div>
      
      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Hotspot Map</TabsTrigger>
          <TabsTrigger value="itinerary">Weekly Itinerary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Crime Hotspot Map</CardTitle>
              <CardDescription>
                Geographical distribution of crime hotspots in the city
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="mx-auto w-full h-full bg-slate-100 rounded-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-md"></div>
                {/* City map with hotspot markers */}
                <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-red-500/40 rounded-full blur-md animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-600/50 rounded-full blur-md animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-orange-500/40 rounded-full blur-md animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-red-500/40 rounded-full blur-md animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-yellow-500/40 rounded-full blur-md animate-pulse"></div>
                
                {/* Main roads */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400/70"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400/70"></div>
                <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300/50"></div>
                <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300/50"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-gray-300/50"></div>
                <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-gray-300/50"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 px-4 py-2 rounded shadow-sm">
                    <p className="text-gray-800 font-medium">City Crime Hotspot Map</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="itinerary" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Patrol Itinerary</CardTitle>
              <CardDescription>
                Scheduled police patrols for hotspot coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!itineraryGenerated ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Generate a weekly itinerary to schedule police teams for hotspot coverage
                  </p>
                  <Button onClick={handleGenerateItinerary}>Generate Itinerary</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Intensity</TableHead>
                      <TableHead>Timings</TableHead>
                      <TableHead>Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.day}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Badge className={getIntensityColor(item.intensity)}>
                            {item.intensity}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.timings}</TableCell>
                        <TableCell>{item.team}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrimeHotspots;
