
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { exportReport } from "../../utils/reportUtils";

interface ReportViewerProps {
  reportType: string;
  trigger?: React.ReactNode;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportType, trigger }) => {
  const [report, setReport] = React.useState({
    id: Math.floor(Math.random() * 10000),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    stats: {
      total: Math.floor(Math.random() * 200),
      resolved: Math.floor(Math.random() * 150),
      pending: Math.floor(Math.random() * 50),
      critical: Math.floor(Math.random() * 20),
    }
  });
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">View Report</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{reportType} Report</DialogTitle>
          <DialogDescription>
            Report generated on {report.date} at {report.time}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.stats.resolved}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((report.stats.resolved / report.stats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((report.stats.pending / report.stats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.stats.critical}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((report.stats.critical / report.stats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => exportReport(reportType)}>Export as CSV</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewer;
