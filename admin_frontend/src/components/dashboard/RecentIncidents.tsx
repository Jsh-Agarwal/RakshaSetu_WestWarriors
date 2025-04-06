
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import ActionMenu from "./ActionMenu";

const RecentIncidents = () => {
  const [incidents] = useState([
    {
      id: "INC-7832",
      type: "Theft",
      location: "Gandhi Nagar Market",
      time: "Today, 14:30",
      status: "New",
      severity: "Medium"
    },
    {
      id: "INC-7831",
      type: "Assault",
      location: "Central Railway Station",
      time: "Today, 13:15",
      status: "In Progress",
      severity: "High"
    },
    {
      id: "INC-7830",
      type: "Vandalism",
      location: "City Park",
      time: "Today, 12:45",
      status: "Resolved",
      severity: "Low"
    },
    {
      id: "INC-7829",
      type: "Burglary",
      location: "Residential Area B",
      time: "Today, 10:20",
      status: "In Progress",
      severity: "Medium"
    },
    {
      id: "INC-7828",
      type: "Traffic Violation",
      location: "Highway Junction",
      time: "Today, 09:05",
      status: "Resolved",
      severity: "Low"
    }
  ]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <Badge className="bg-red-500">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <Badge className="bg-blue-500">New</Badge>;
      case "In Progress":
        return <Badge className="bg-purple-500">In Progress</Badge>;
      case "Resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{incident.id}</TableCell>
                <TableCell>{incident.type}</TableCell>
                <TableCell>{incident.location}</TableCell>
                <TableCell>{incident.time}</TableCell>
                <TableCell>{getStatusBadge(incident.status)}</TableCell>
                <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                <TableCell>
                  <ActionMenu incidentId={incident.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentIncidents;
