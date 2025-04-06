
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SOSAlertsProps {
  className?: string;
}

const SOSAlerts: React.FC<SOSAlertsProps> = ({ className }) => {
  const handleRespond = (id: string) => {
    toast({
      title: "Responding to Alert",
      description: `Dispatching response team to SOS alert #${id}`
    });
  };

  const recentSOSAlerts = [
    { id: "SOS-2584", location: "Malviya Nagar", time: "2 mins ago", status: "New" },
    { id: "SOS-2583", location: "Hauz Khas", time: "15 mins ago", status: "Responding" },
    { id: "SOS-2582", location: "Connaught Place", time: "27 mins ago", status: "New" },
  ];

  return (
    <Card className={cn("sos-alerts", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-raksha-danger" />
            <CardTitle>Active SOS Alerts</CardTitle>
          </div>
          <CardDescription>Emergency alerts requiring immediate attention</CardDescription>
        </div>
        <Badge variant="destructive" className="text-white">
          {recentSOSAlerts.length} Active
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSOSAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg border border-dashed border-muted-foreground/50 p-3"
            >
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-raksha-danger mt-2"></div>
                <div>
                  <div className="font-medium">{alert.id}</div>
                  <div className="text-xs text-muted-foreground">{alert.location} • {alert.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={alert.status === "New" ? "destructive" : "outline"}>
                  {alert.status}
                </Badge>
                <Button size="sm" onClick={() => handleRespond(alert.id)}>Respond</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-muted-foreground">Updated just now</div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/alerts" className="flex items-center">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SOSAlerts;
