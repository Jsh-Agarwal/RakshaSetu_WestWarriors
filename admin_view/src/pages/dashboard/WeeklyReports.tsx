
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const weeklyData = [
  { day: 'Mon', incidents: 15 },
  { day: 'Tue', incidents: 20 },
  { day: 'Wed', incidents: 18 },
  { day: 'Thu', incidents: 23 },
  { day: 'Fri', incidents: 35 },
  { day: 'Sat', incidents: 38 },
  { day: 'Sun', incidents: 18 },
];

const WeeklyReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Weekly Reports</h1>
      </div>
      <p className="text-muted-foreground">
        All incidents reported this week (March 30 - April 5, 2025)
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>Daily incident reports this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="Incidents" 
                    dataKey="incidents" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>This week's statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Total Reports</div>
                <div className="font-medium">167</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Compared to Last Week</div>
                <div className="font-medium text-green-600">+8%</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Verification Rate</div>
                <div className="font-medium">87%</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Critical Incidents</div>
                <div className="font-medium">12</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Peak Day</div>
                <div className="font-medium">Saturday (38)</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Most Common Type</div>
                <div className="font-medium">Theft (42)</div>
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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Reports List
            </CardTitle>
            <CardDescription>All incidents reported this week</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Sample data rows */}
              <TableRow>
                <TableCell>INC-5723</TableCell>
                <TableCell>Apr 5</TableCell>
                <TableCell>Armed Robbery</TableCell>
                <TableCell>M-Block Market, GK-1</TableCell>
                <TableCell>Violent Crime</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INC-5715</TableCell>
                <TableCell>Apr 4</TableCell>
                <TableCell>Vehicle Collision</TableCell>
                <TableCell>Ring Road</TableCell>
                <TableCell>Accident</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </TableCell>
              </TableRow>
              {/* More rows would be here */}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">Load More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReports;
