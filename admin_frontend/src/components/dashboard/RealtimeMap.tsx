
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const RealtimeMap: React.FC = () => {
  const [mapTokenInput, setMapTokenInput] = useState("");
  const [isMapVisible, setIsMapVisible] = useState(false);

  // This would be replaced with actual MapBox integration
  const enableMap = () => {
    setIsMapVisible(true);
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Real-time Incident Map</CardTitle>
            <CardDescription>Live incident reports across the city</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Info className="h-4 w-4" />
                  <span>Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>
                  This map shows real-time incidents. For a production environment, you would need to add your Mapbox API token.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {isMapVisible ? (
          <div className="relative h-[400px] rounded-md border bg-muted/30">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Placeholder for actual map */}
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Map would render here with Mapbox integration</p>
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
            <div className="absolute right-2 top-2">
              <Button size="sm" variant="destructive" className="gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span>SOS Alerts</span>
                <span className="ml-1 rounded-full bg-white px-1.5 text-xs text-destructive">3</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-md border bg-muted/30 p-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Enter Mapbox API Token</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              To display the interactive map, you need to provide a Mapbox API token.
            </p>
            <div className="mt-4 w-full max-w-md space-y-4">
              <input
                type="text"
                value={mapTokenInput}
                onChange={(e) => setMapTokenInput(e.target.value)}
                placeholder="Enter your Mapbox token here"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
      <CardFooter className="flex items-center justify-between border-t px-6 py-3">
        <div className="text-sm text-muted-foreground">Last updated: 2 minutes ago</div>
        <Button variant="ghost" size="sm">
          View Full Map
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RealtimeMap;
