
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import CrimeLineChart from "@/components/dashboard/CrimeLineChart";
import CrimeCategoriesPieChart from "@/components/dashboard/CrimeCategoriesPieChart";
import SeverityBarChart from "@/components/dashboard/SeverityBarChart";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import SOSAlerts from "@/components/dashboard/SOSAlerts";
import { Button } from "@/components/ui/button";
import ActivityLog from "../components/dashboard/ActivityLog";
import { exportReport } from "../utils/reportUtils";

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <ActivityLog />
          <Button onClick={() => exportReport("Dashboard")} variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Crime Rate"
          value="-8%"
          description="From previous month"
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Reports Today"
          value="24"
          description="12 verified, 12 pending"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Response Time"
          value="8.2 mins"
          description="2.1 mins less than target"
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Active Alerts"
          value="6"
          description="2 critical, 4 high priority"
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Crime Trends</CardTitle>
            <CardDescription>Monthly crime incidents over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <CrimeLineChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incident Categories</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent>
            <CrimeCategoriesPieChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <RecentIncidents />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <SOSAlerts />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verification Rate</CardTitle>
            <CardDescription>Report verification performance</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SeverityBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Area Coverage</CardTitle>
            <CardDescription>Patrol coverage by district</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">North District</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">East District</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">South District</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">West District</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Central District</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
