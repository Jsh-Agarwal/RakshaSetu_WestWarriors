
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Flag, Shield, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for flagged reporters
const flaggedReporters = [
  {
    id: "FR-001",
    name: "Ankit Sharma",
    credibilityScore: 35,
    totalReports: 7,
    flagReason: "AI analysis mismatch",
    status: "pending"
  },
  {
    id: "FR-002",
    name: "Priya Patel",
    credibilityScore: 42,
    totalReports: 4,
    flagReason: "Location spoofing detected",
    status: "confirmed"
  },
  {
    id: "FR-003",
    name: "Raj Kumar",
    credibilityScore: 28,
    totalReports: 11,
    flagReason: "Insufficient evidence",
    status: "confirmed"
  },
  {
    id: "FR-004",
    name: "Sneha Singh",
    credibilityScore: 61,
    totalReports: 3,
    flagReason: "Pattern inconsistency",
    status: "cleared"
  },
  {
    id: "FR-005",
    name: "Vikram Joshi",
    credibilityScore: 47,
    totalReports: 8,
    flagReason: "Multiple fabricated reports",
    status: "pending"
  }
];

const FakeReporterDetection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fake Reporter Detection</h1>
          <p className="text-muted-foreground">
            Monitor and manage reporters flagged by the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="confirmed">Confirmed Fake</SelectItem>
              <SelectItem value="cleared">Cleared</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Flag className="mr-2 h-4 w-4" />
            Review Guidelines
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Reporters</CardTitle>
          <CardDescription>
            Users flagged for potential false reporting based on AI analysis and pattern recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Reporter Name</TableHead>
                <TableHead>Credibility Score</TableHead>
                <TableHead>Total Reports</TableHead>
                <TableHead>Flag Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedReporters.map((reporter) => (
                <TableRow key={reporter.id}>
                  <TableCell className="font-medium">{reporter.id}</TableCell>
                  <TableCell>{reporter.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{reporter.credibilityScore}%</span>
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div 
                          className={`h-2 rounded-full ${
                            reporter.credibilityScore < 40 ? 'bg-red-500' : 
                            reporter.credibilityScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${reporter.credibilityScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{reporter.totalReports}</TableCell>
                  <TableCell>{reporter.flagReason}</TableCell>
                  <TableCell>
                    {reporter.status === 'pending' && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                    )}
                    {reporter.status === 'confirmed' && (
                      <Badge variant="destructive">Confirmed Fake</Badge>
                    )}
                    {reporter.status === 'cleared' && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Cleared</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Shield className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </Button>
                    </div>
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

export default FakeReporterDetection;
