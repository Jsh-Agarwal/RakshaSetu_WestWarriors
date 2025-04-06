
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, Clock, Download, FileText, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { hour: '00:00', today: 0, yesterday: 1 },
  { hour: '02:00', today: 0, yesterday: 0 },
  { hour: '04:00', today: 0, yesterday: 0 },
  { hour: '06:00', today: 1, yesterday: 0 },
  { hour: '08:00', today: 3, yesterday: 2 },
  { hour: '10:00', today: 4, yesterday: 3 },
  { hour: '12:00', today: 5, yesterday: 4 },
  { hour: '14:00', today: 6, yesterday: 5 },
  { hour: '16:00', today: 3, yesterday: 4 },
  { hour: '18:00', today: 2, yesterday: 2 },
  { hour: '20:00', today: 0, yesterday: 1 },
  { hour: '22:00', today: 0, yesterday: 0 },
];

// Sample data for incidents
const incidents = [
  {
    id: "INC-5723",
    title: "Armed Robbery",
    location: "M-Block Market, GK-1",
    time: "14:30",
    status: "verified",
    severity: "critical",
    category: "Violent Crime",
  },
  {
    id: "INC-5722",
    title: "Vehicle Theft",
    location: "Sector 18, Noida",
    time: "15:15",
    status: "pending",
    severity: "medium",
    category: "Theft",
  },
  {
    id: "INC-5721",
    title: "Suspicious Activity",
    location: "Connaught Place",
    time: "12:10",
    status: "pending",
    severity: "low",
    category: "Suspicious Activity",
  },
  {
    id: "INC-5720",
    title: "Shop Vandalism",
    location: "Sarojini Nagar Market",
    time: "10:45",
    status: "verified",
    severity: "medium",
    category: "Vandalism",
  },
  {
    id: "INC-5719",
    title: "Fake SOS Call",
    location: "South Extension",
    time: "09:20",
    status: "rejected",
    severity: "low",
    category: "False Report",
  },
];

const TodayReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Today's Reports</h1>
      </div>
      <p className="text-muted-foreground">
        All incidents reported on April 5, 2025
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today vs Yesterday Comparison</CardTitle>
            <CardDescription>Hourly report comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }} 
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar name="Today" dataKey="today" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar name="Yesterday" dataKey="yesterday" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Today's statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Total Reports</div>
                <div className="font-medium">24</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Compared to Yesterday</div>
                <div className="font-medium text-green-600">+12%</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Verification Rate</div>
                <div className="font-medium">75%</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Critical Incidents</div>
                <div className="font-medium">3</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Most Common Type</div>
                <div className="font-medium">Theft (8)</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Peak Reporting Time</div>
                <div className="font-medium">2:00 PM - 4:00 PM</div>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full gap-1">
                  <Download className="h-4 w-4" /> Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>All Reports Today</CardTitle>
            <CardDescription>List of all incidents reported today</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>{incident.time}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        incident.status === "verified" ? "border-green-200 bg-green-50 text-green-700" :
                        incident.status === "pending" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                        "border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      <span className="flex items-center gap-1">
                        {incident.status === "verified" && <CheckCircle className="h-3 w-3" />}
                        {incident.status === "pending" && <Clock className="h-3 w-3" />}
                        {incident.status === "rejected" && <X className="h-3 w-3" />}
                        <span className="capitalize">{incident.status}</span>
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        incident.severity === "critical" ? "border-red-200 bg-red-50 text-red-700" :
                        incident.severity === "high" ? "border-orange-200 bg-orange-50 text-orange-700" :
                        incident.severity === "medium" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                        "border-green-200 bg-green-50 text-green-700"
                      }
                    >
                      <span className="capitalize">{incident.severity}</span>
                    </Badge>
                  </TableCell>
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
