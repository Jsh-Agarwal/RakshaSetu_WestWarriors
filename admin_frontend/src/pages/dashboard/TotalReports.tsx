
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, FileText, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";

const trendData = [
  { month: 'Jan', incidents: 520 },
  { month: 'Feb', incidents: 648 },
  { month: 'Mar', incidents: 702 },
  { month: 'Apr', incidents: 735 },
  { month: 'May', incidents: 810 },
  { month: 'Jun', incidents: 842 },
  { month: 'Jul', incidents: 901 },
  { month: 'Aug', incidents: 842 },
  { month: 'Sep', incidents: 746 },
  { month: 'Oct', incidents: 812 },
  { month: 'Nov', incidents: 736 },
  { month: 'Dec', incidents: 898 },
];

const TotalReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Total Reports</h1>
      </div>
      <p className="text-muted-foreground">
        All incidents reported in the system
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Incident Reporting Trend</CardTitle>
          <CardDescription>Monthly incidents over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8,392</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verification Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">86%</div>
            <p className="text-sm text-muted-foreground">7,217 verified incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">699</div>
            <p className="text-sm text-muted-foreground">Incidents per month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>Complete list of all reported incidents</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 w-[250px]" placeholder="Search incidents..." />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INC-5723</TableCell>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>Armed Robbery</TableCell>
                <TableCell>Violent Crime</TableCell>
                <TableCell>M-Block Market, GK-1</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INC-5722</TableCell>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>Vehicle Theft</TableCell>
                <TableCell>Theft</TableCell>
                <TableCell>Sector 18, Noida</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INC-5721</TableCell>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>Suspicious Activity</TableCell>
                <TableCell>Suspicious Activity</TableCell>
                <TableCell>Connaught Place</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INC-5720</TableCell>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>Shop Vandalism</TableCell>
                <TableCell>Vandalism</TableCell>
                <TableCell>Sarojini Nagar Market</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INC-5719</TableCell>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>Fake SOS Call</TableCell>
                <TableCell>False Report</TableCell>
                <TableCell>South Extension</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing 5 of 8,392 entries
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                ...
              </Button>
              <Button variant="outline" size="sm">
                839
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalReports;
