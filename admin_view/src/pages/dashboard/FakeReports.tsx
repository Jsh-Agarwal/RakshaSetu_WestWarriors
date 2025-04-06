
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertTriangle, 
  ArrowLeft, 
  BarChart4, 
  Download, 
  Filter, 
  ShieldAlert, 
  ThumbsDown, 
  User 
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const trendData = [
  { month: 'Jan', value: 5 },
  { month: 'Feb', value: 8 },
  { month: 'Mar', value: 7 },
  { month: 'Apr', value: 13 }
];

const fakeReports = [
  {
    id: "INC-5719",
    title: "Fake SOS Call",
    location: "South Extension",
    date: "2025-04-05",
    reporter: "Akash Malhotra",
    reporterId: "RST-U2348",
    credibility: 78,
    reason: "Inconsistent Statement",
    aiConfidence: 92,
  },
  {
    id: "INC-5706",
    title: "False Theft Report",
    location: "Janakpuri",
    date: "2025-04-04",
    reporter: "Priya Verma",
    reporterId: "RST-U1986",
    credibility: 65,
    reason: "Conflicting Evidence",
    aiConfidence: 88,
  },
  {
    id: "INC-5691",
    title: "Misreported Assault",
    location: "Vasant Kunj",
    date: "2025-04-02",
    reporter: "Rahul Mehta",
    reporterId: "RST-U5631",
    credibility: 72,
    reason: "Location Verification Failed",
    aiConfidence: 85,
  },
  {
    id: "INC-5682",
    title: "False Break-in Report",
    location: "Dwarka",
    date: "2025-04-02",
    reporter: "Alok Singh",
    reporterId: "RST-U3457",
    credibility: 81,
    reason: "Inconsistent Timeline",
    aiConfidence: 79,
  },
  {
    id: "INC-5664",
    title: "Exaggerated Damage Report",
    location: "Rohini",
    date: "2025-03-31",
    reporter: "Meera Patel",
    reporterId: "RST-U7659",
    credibility: 90,
    reason: "Evidence Mismatch",
    aiConfidence: 94,
  },
];

const FakeReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Fake Reports</h1>
      </div>
      <p className="text-muted-foreground">
        Analysis and management of flagged fake reports
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fake Reports Trend</CardTitle>
            <CardDescription>Monthly false reports detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar name="Fake Reports" dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Fake reports statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Current Month</div>
                <div className="font-medium">13</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Previous Month</div>
                <div className="font-medium">7</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Monthly Change</div>
                <div className="font-medium text-red-600">+85.7%</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Most Common Reason</div>
                <div className="font-medium">Inconsistent Statement</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Top Location</div>
                <div className="font-medium">South Extension</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">AI Detection Rate</div>
                <div className="font-medium">92%</div>
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
              <ShieldAlert className="h-5 w-5 text-raksha-danger" />
              Flagged Reports
            </CardTitle>
            <CardDescription>Recent reports flagged as potentially false</CardDescription>
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
                <TableHead>Report</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Credibility</TableHead>
                <TableHead>Flag Reason</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-xs text-muted-foreground">{report.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{report.reporter}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-[80px] rounded-full bg-gray-200 overflow-hidden`}>
                        <div 
                          className={`h-full ${
                            report.credibility > 80 ? 'bg-green-500' : 
                            report.credibility > 70 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${report.credibility}%` }}
                        ></div>
                      </div>
                      <span>{report.credibility}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                      {report.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span>{report.aiConfidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                    </Button>
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

export default FakeReports;
