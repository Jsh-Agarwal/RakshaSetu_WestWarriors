
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TeamDispatchForm from "../components/dashboard/TeamDispatchForm";
import { toast } from "@/hooks/use-toast";

const LiveTracking = () => {
  const [teams] = useState([
    {
      id: "T-001",
      name: "Team Alpha",
      members: "3 officers",
      location: "Central Market",
      status: "Active",
      incident: "Theft Report"
    },
    {
      id: "T-002",
      name: "Team Bravo",
      members: "4 officers",
      location: "Railway Station",
      status: "En Route",
      incident: "Assault"
    },
    {
      id: "T-003",
      name: "Team Charlie",
      members: "2 officers",
      location: "Shopping Mall",
      status: "On Scene",
      incident: "Suspicious Activity"
    },
    {
      id: "T-004",
      name: "Team Delta",
      members: "5 officers",
      location: "Residential Area C",
      status: "Returning",
      incident: "Domestic Dispute"
    },
    {
      id: "T-005",
      name: "Special Response",
      members: "6 officers",
      location: "City Park",
      status: "Standby",
      incident: "-"
    }
  ]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "En Route":
        return <Badge className="bg-blue-500">En Route</Badge>;
      case "On Scene":
        return <Badge className="bg-yellow-500">On Scene</Badge>;
      case "Returning":
        return <Badge className="bg-purple-500">Returning</Badge>;
      case "Standby":
        return <Badge className="bg-gray-500">Standby</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Live Crime Tracking</h2>
        <TeamDispatchForm />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 on incidents, 2 on patrol
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 high priority, 8 medium/low
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.3 min</div>
            <p className="text-xs text-muted-foreground">
              -1.2 min from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coverage Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              +4% from last shift
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Live Map</CardTitle>
            <CardDescription>Real-time location of teams and incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-slate-100 rounded-md relative">
              {/* Simulated map with team markers */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full"></div>
              
              <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-green-500 rounded-full"></div>
              
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-yellow-500 rounded-full"></div>
              
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-purple-500 rounded-full"></div>
              
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-gray-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-gray-500 rounded-full"></div>
              
              {/* Incident markers */}
              <div className="absolute top-1/5 left-1/3 w-3 h-3 bg-red-500 rounded-sm"></div>
              <div className="absolute top-1/2 left-1/5 w-3 h-3 bg-red-500 rounded-sm"></div>
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-sm"></div>
              <div className="absolute bottom-1/4 right-1/5 w-3 h-3 bg-red-500 rounded-sm"></div>
              
              {/* City grid overlay */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-slate-200/30"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Incident Response Teams</CardTitle>
          <CardDescription>
            Current deployed teams and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Incident</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.id}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.members}</TableCell>
                  <TableCell>{team.location}</TableCell>
                  <TableCell>{getStatusBadge(team.status)}</TableCell>
                  <TableCell>{team.incident}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTracking;
