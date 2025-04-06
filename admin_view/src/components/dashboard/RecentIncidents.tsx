
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  title: string;
  location: string;
  time: string;
  status: "pending" | "verified" | "false";
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  aiVerified: boolean;
}

const incidents: Incident[] = [
  {
    id: "INC-5723",
    title: "Armed Robbery",
    location: "M-Block Market, GK-1",
    time: "35 mins ago",
    status: "verified",
    severity: "critical",
    category: "Violent Crime",
    aiVerified: true,
  },
  {
    id: "INC-5722",
    title: "Vehicle Theft",
    location: "Sector 18, Noida",
    time: "1 hour ago",
    status: "pending",
    severity: "medium",
    category: "Theft",
    aiVerified: true,
  },
  {
    id: "INC-5721",
    title: "Suspicious Activity",
    location: "Connaught Place",
    time: "2 hours ago",
    status: "pending",
    severity: "low",
    category: "Suspicious Activity",
    aiVerified: false,
  },
  {
    id: "INC-5720",
    title: "Shop Vandalism",
    location: "Sarojini Nagar Market",
    time: "3 hours ago",
    status: "verified",
    severity: "medium",
    category: "Vandalism",
    aiVerified: true,
  },
  {
    id: "INC-5719",
    title: "Fake SOS Call",
    location: "South Ex",
    time: "4 hours ago",
    status: "false",
    severity: "low",
    category: "False Report",
    aiVerified: true,
  },
];

const RecentIncidents: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Latest reported crimes</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-4 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-2">INCIDENT</div>
            <div>STATUS</div>
            <div className="text-right">ACTION</div>
          </div>
          <div className="divide-y">
            {incidents.map((incident) => (
              <div key={incident.id} className="grid grid-cols-4 items-center px-4 py-3">
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        incident.severity === "critical" && "bg-red-500",
                        incident.severity === "high" && "bg-orange-500",
                        incident.severity === "medium" && "bg-yellow-500",
                        incident.severity === "low" && "bg-green-500"
                      )}
                    ></div>
                    <span className="font-medium">{incident.title}</span>
                    {incident.aiVerified && (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        <CheckCircle className="mr-1 h-3 w-3" /> AI-Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span>{incident.id}</span>
                    <span>•</span>
                    <span>{incident.location}</span>
                    <span>•</span>
                    <span>{incident.time}</span>
                  </div>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      incident.status === "verified" && "border-green-200 bg-green-50 text-green-700",
                      incident.status === "pending" && "border-yellow-200 bg-yellow-50 text-yellow-700",
                      incident.status === "false" && "border-red-200 bg-red-50 text-red-700"
                    )}
                  >
                    {incident.status === "verified" && "Verified"}
                    {incident.status === "pending" && "Pending Verification"}
                    {incident.status === "false" && "False Report"}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Button variant="outline" className="gap-1 text-xs">
            <span>View All Incidents</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentIncidents;
