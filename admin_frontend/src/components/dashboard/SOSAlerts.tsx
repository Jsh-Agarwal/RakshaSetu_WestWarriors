
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
import { Button } from "../ui/button";

const SOSAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: "SOS-4532",
      user: "Rahul Sharma",
      location: "Sector 18 Market",
      time: "Today, 15:10",
      status: "Active",
      priority: "Critical",
      actionTaken: false
    },
    {
      id: "SOS-4531",
      user: "Aisha Patel",
      location: "Central Park",
      time: "Today, 14:45",
      status: "Responded",
      priority: "High",
      actionTaken: true
    },
    {
      id: "SOS-4530",
      user: "Rajiv Kumar",
      location: "Metro Station East",
      time: "Today, 13:30",
      status: "Resolved",
      priority: "High",
      actionTaken: true
    },
    {
      id: "SOS-4529",
      user: "Meera Singh",
      location: "College Road",
      time: "Today, 13:15",
      status: "Resolved",
      priority: "Medium",
      actionTaken: true
    }
  ]);

  const handleActionTaken = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, actionTaken: true, status: alert.status === "Active" ? "Responded" : alert.status } : alert
    ));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge className="bg-red-600">Critical</Badge>;
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
      case "Active":
        return <Badge className="bg-red-500 animate-pulse">Active</Badge>;
      case "Responded":
        return <Badge className="bg-blue-500">Responded</Badge>;
      case "Resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SOS Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className={alert.status === "Active" ? "bg-red-50" : ""}>
                <TableCell className="font-medium">{alert.id}</TableCell>
                <TableCell>{alert.user}</TableCell>
                <TableCell>{alert.location}</TableCell>
                <TableCell>{alert.time}</TableCell>
                <TableCell>{getStatusBadge(alert.status)}</TableCell>
                <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                <TableCell>
                  {alert.actionTaken ? (
                    <Button variant="ghost" size="sm" disabled className="text-green-600">
                      Action Taken
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleActionTaken(alert.id)}>
                      Actions
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SOSAlerts;
