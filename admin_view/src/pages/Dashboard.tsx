
import React from "react";
import { Activity, AlertTriangle, BarChart4, CheckCircle, Clock, FileBarChart, FileText, MapPin, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import CrimeLineChart from "@/components/dashboard/CrimeLineChart";
import CrimeCategoriesPieChart from "@/components/dashboard/CrimeCategoriesPieChart";
import SeverityBarChart from "@/components/dashboard/SeverityBarChart";
import RealtimeMap from "@/components/dashboard/RealtimeMap";
import SOSAlerts from "@/components/dashboard/SOSAlerts";
import RecentIncidents from "@/components/dashboard/RecentIncidents";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of crime reports, incidents, and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export Reports
          </Button> */}
          {/* <Button size="sm">
            <Activity className="mr-2 h-4 w-4" />
            View Activity Log
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard 
          title="Today's Reports" 
          value="24" 
          icon={<FileText className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          description="12% increase from yesterday" 
          linkTo="/dashboard/today-reports"
        />
        <StatCard 
          title="This Week" 
          value="167" 
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
          description="8% increase from last week" 
          linkTo="/dashboard/weekly-reports"
        />
        <StatCard 
          title="Total Reports" 
          value="8,392" 
          icon={<FileBarChart className="h-4 w-4" />}
          linkTo="/dashboard/total-reports"
        />
        <StatCard 
          title="Verification Rate" 
          value="92%" 
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
          description="3% improvement from last month" 
          linkTo="/dashboard/verification-rate"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-1">
        <CrimeLineChart />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CrimeCategoriesPieChart />
        <SeverityBarChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RealtimeMap />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RecentIncidents />
        <SOSAlerts className="md:col-span-2" />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard 
          title="Active SOS Alerts" 
          value="3" 
          icon={<AlertTriangle className="h-4 w-4 text-raksha-danger" />}
          className="border-raksha-danger border-l-4"
          linkTo="/dashboard/sos-alerts"
        />
        <StatCard 
          title="Crime Hotspots" 
          value="7" 
          icon={<MapPin className="h-4 w-4 text-raksha-warning" />}
          className="border-raksha-warning border-l-4"
          linkTo="/dashboard/crime-hotspots"
        />
        <StatCard 
          title="Response Time (Avg)" 
          value="4.2 min" 
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
          linkTo="/dashboard/response-time"
        />
        <StatCard 
          title="Fake Reports" 
          value="13" 
          icon={<ShieldAlert className="h-4 w-4 text-raksha-blue" />}
          trend={{ value: 5, isPositive: false }}
          description="5% increase from last week" 
          linkTo="/dashboard/fake-reports"
        />
      </div>
    </div>
  );
};

export default Dashboard;
