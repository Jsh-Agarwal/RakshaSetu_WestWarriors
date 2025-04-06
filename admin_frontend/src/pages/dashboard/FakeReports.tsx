
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

const FakeReports = () => {
  const reports = [
    {
      id: "FR-5621",
      reportType: "Theft",
      location: "Gandhi Nagar",
      dateReported: "Apr 2, 2025",
      reporter: "User #28754",
      status: "Confirmed Fake"
    },
    {
      id: "FR-5620",
      reportType: "Assault",
      location: "Central Park",
      dateReported: "Apr 1, 2025",
      reporter: "User #45128",
      status: "Under Review"
    },
    {
      id: "FR-5619",
      reportType: "Vandalism",
      location: "Market Road",
      dateReported: "Mar 31, 2025",
      reporter: "User #12547",
      status: "Confirmed Fake"
    },
    {
      id: "FR-5618",
      reportType: "Theft",
      location: "Railway Station",
      dateReported: "Mar 30, 2025",
      reporter: "User #39854",
      status: "Under Review"
    },
    {
      id: "FR-5617",
      reportType: "Public Nuisance",
      location: "Shopping Complex",
      dateReported: "Mar 29, 2025",
      reporter: "User #14528",
      status: "Confirmed Fake"
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed Fake":
        return <Badge className="bg-red-500">Confirmed Fake</Badge>;
      case "Under Review":
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case "Needs Verification":
        return <Badge className="bg-blue-500">Needs Verification</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Fake Reports</h2>
        <Button onClick={() => exportReport("Fake Reports")}>Export Report</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fake Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.8% from previous month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Fake Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Theft</div>
            <p className="text-xs text-muted-foreground">
              46% of fake reports
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Fake Reports</CardTitle>
          <CardDescription>
            Reports identified as potentially false
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.reportType}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{report.dateReported}</TableCell>
                  <TableCell>{report.reporter}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FakeReports;
