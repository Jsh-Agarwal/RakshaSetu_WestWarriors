
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { exportReport } from "../utils/reportUtils";

const FakeReporterDetection = () => {
  const [fakeReporters, setFakeReporters] = useState([
    {
      id: "FR-29385",
      name: "Raj Kumar",
      phone: "+91-98XXXXXXXX",
      reportCount: 12,
      falseReports: 8,
      status: "Flagged",
      lastReport: "2 days ago",
      actionTaken: null,
    },
    {
      id: "FR-29384",
      name: "Sanjay Verma",
      phone: "+91-87XXXXXXXX",
      reportCount: 18,
      falseReports: 15,
      status: "Blocked",
      lastReport: "1 week ago",
      actionTaken: "Account blocked on 2025-04-02",
    },
    {
      id: "FR-29383",
      name: "Priya Sharma",
      phone: "+91-76XXXXXXXX",
      reportCount: 5,
      falseReports: 4,
      status: "Flagged",
      lastReport: "3 days ago",
      actionTaken: null,
    },
    {
      id: "FR-29382",
      name: "Ajay Singh",
      phone: "+91-95XXXXXXXX",
      reportCount: 9,
      falseReports: 7,
      status: "Under Review",
      lastReport: "Today",
      actionTaken: null,
    },
    {
      id: "FR-29381",
      name: "Neha Patel",
      phone: "+91-99XXXXXXXX",
      reportCount: 14,
      falseReports: 3,
      status: "Cleared",
      lastReport: "Yesterday",
      actionTaken: "Account cleared on 2025-04-04",
    }
  ]);
  
  const [actionUser, setActionUser] = useState<any>(null);
  const [actionType, setActionType] = useState("flag");
  const [actionReason, setActionReason] = useState("");
  
  const handleAction = (reporter: any) => {
    setActionUser(reporter);
    setActionType("flag");
    setActionReason("");
  };
  
  const submitAction = () => {
    const actions = {
      flag: "flagged",
      block: "blocked",
      warn: "warned",
      clear: "cleared"
    };
    
    const actionName = actions[actionType as keyof typeof actions];
    const currentDate = new Date().toISOString().split('T')[0];
    const actionDescription = `Account ${actionName} on ${currentDate}`;
    
    // Update user with action taken info
    setFakeReporters(fakeReporters.map(reporter => 
      reporter.id === actionUser.id 
      ? { ...reporter, status: actionName.charAt(0).toUpperCase() + actionName.slice(1), actionTaken: actionDescription } 
      : reporter
    ));
    
    toast({
      title: `User ${actionName}`,
      description: `${actionUser.name} has been ${actionName} successfully.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Blocked":
        return <Badge className="bg-red-500">Blocked</Badge>;
      case "Flagged":
        return <Badge className="bg-yellow-500">Flagged</Badge>;
      case "Under Review":
        return <Badge className="bg-blue-500">Under Review</Badge>;
      case "Cleared":
        return <Badge className="bg-green-500">Cleared</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Fake Reporter Detection</h2>
        <Button onClick={() => exportReport("Fake Reporters")}>
          Export Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detection Metrics</CardTitle>
          <CardDescription>
            System performance in detecting fake reporters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Detection Accuracy</span>
              <span className="text-2xl font-bold">94.3%</span>
              <span className="text-xs text-muted-foreground">+1.2% from last week</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">False Positives</span>
              <span className="text-2xl font-bold">3.8%</span>
              <span className="text-xs text-muted-foreground">-0.5% from last week</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Reports Analyzed</span>
              <span className="text-2xl font-bold">1,253</span>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Flagged Reporters</CardTitle>
          <CardDescription>
            Users flagged for submitting false or misleading reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Reports</TableHead>
                <TableHead>False Reports</TableHead>
                <TableHead>Last Report</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeReporters.map((reporter) => (
                <TableRow key={reporter.id}>
                  <TableCell className="font-medium">{reporter.id}</TableCell>
                  <TableCell>{reporter.name}</TableCell>
                  <TableCell>{reporter.phone}</TableCell>
                  <TableCell>{reporter.reportCount}</TableCell>
                  <TableCell>{reporter.falseReports}</TableCell>
                  <TableCell>{reporter.lastReport}</TableCell>
                  <TableCell>{getStatusBadge(reporter.status)}</TableCell>
                  <TableCell>{reporter.actionTaken || "-"}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAction(reporter)}
                          disabled={reporter.status === "Blocked"}
                        >
                          {reporter.actionTaken ? "Update" : "Action"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Take Action</DialogTitle>
                          <DialogDescription>
                            Select action for user {actionUser?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <RadioGroup value={actionType} onValueChange={setActionType}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="flag" id="flag" />
                              <Label htmlFor="flag">Flag Account</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="block" id="block" />
                              <Label htmlFor="block">Block Account</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="warn" id="warn" />
                              <Label htmlFor="warn">Send Warning</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="clear" id="clear" />
                              <Label htmlFor="clear">Clear Status</Label>
                            </div>
                          </RadioGroup>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                              id="reason"
                              value={actionReason}
                              onChange={(e) => setActionReason(e.target.value)}
                              placeholder="Enter reason for this action..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={submitAction}>Submit</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
