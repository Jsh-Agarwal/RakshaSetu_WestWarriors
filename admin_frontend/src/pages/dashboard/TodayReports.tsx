
import React from "react";
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
import { exportReport } from "../../utils/reportUtils";
import ReportViewer from "../../components/dashboard/ReportViewer";

const TodayReports = () => {
  const reports = [
    {
      id: "REP-7901",
      type: "Theft",
      location: "Market Area",
      time: "09:15 AM",
      status: "Verified",
      reporter: "Mobile App"
    },
    {
      id: "REP-7902",
      type: "Assault",
      location: "Central Park",
      time: "10:30 AM",
      status: "Pending",
      reporter: "Phone Call"
    },
    {
      id: "REP-7903",
      type: "Vandalism",
      location: "School Zone",
      time: "11:45 AM",
      status: "Verified",
      reporter: "Mobile App"
    },
    {
      id: "REP-7904",
      type: "Traffic Violation",
      location: "Highway Junction",
      time: "12:20 PM",
      status: "Rejected",
      reporter: "Mobile App"
    },
    {
      id: "REP-7905",
      type: "Public Nuisance",
      location: "Residential Area",
      time: "01:35 PM",
      status: "Pending",
      reporter: "Phone Call"
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Today's Reports</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => exportReport("Today's Reports")} variant="outline">Export Report</Button>
          <ReportViewer reportType="Today's Reports" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              75% verification rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.3 min</div>
            <p className="text-xs text-muted-foreground">
              -2.1 min from average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Theft</div>
            <p className="text-xs text-muted-foreground">
              7 reports (29%)
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Reports received today
          </CardDescription>
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
                <TableHead>Reporter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{report.time}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.reporter}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodayReports;
