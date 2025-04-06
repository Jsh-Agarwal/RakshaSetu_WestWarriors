
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, BarChart, Bar, Cell } from "recharts";
import { BarChart2, Download, Map, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const lineChartData = [
  { day: 'Mon', violent: 12, theft: 18, vandalism: 5, others: 8 },
  { day: 'Tue', violent: 19, theft: 15, vandalism: 7, others: 10 },
  { day: 'Wed', violent: 15, theft: 12, vandalism: 9, others: 5 },
  { day: 'Thu', violent: 13, theft: 20, vandalism: 4, others: 7 },
  { day: 'Fri', violent: 18, theft: 25, vandalism: 8, others: 12 },
  { day: 'Sat', violent: 24, theft: 30, vandalism: 12, others: 15 },
  { day: 'Sun', violent: 20, theft: 26, vandalism: 10, others: 13 },
];

const pieChartData = [
  { name: "Theft", value: 35, color: "#0ea5e9" },
  { name: "Assault", value: 20, color: "#ef4444" },
  { name: "Vandalism", value: 15, color: "#eab308" },
  { name: "Fraud", value: 12, color: "#8b5cf6" },
  { name: "Others", value: 18, color: "#6b7280" },
];

const barChartData = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "High", value: 24, color: "#f97316" },
  { name: "Medium", value: 53, color: "#eab308" },
  { name: "Low", value: 87, color: "#22c55e" },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and trends from reported incidents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends" className="gap-2">
            <BarChart2 className="h-4 w-4" /> Crime Trends
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <PieChartIcon className="h-4 w-4" /> Categories
          </TabsTrigger>
          <TabsTrigger value="severity" className="gap-2">
            <BarChart2 className="h-4 w-4" /> Severity
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <Map className="h-4 w-4" /> Map View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crime Trend Analysis</CardTitle>
              <CardDescription>Weekly trend of incidents by crime type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="violent"
                      name="Violent"
                      stroke="#ef4444"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="theft"
                      name="Theft"
                      stroke="#0ea5e9"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="vandalism"
                      name="Vandalism"
                      stroke="#eab308"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="others"
                      name="Others"
                      stroke="#8b5cf6"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crime Categories</CardTitle>
              <CardDescription>Distribution of incidents by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} incidents`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="severity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Severity Analysis</CardTitle>
              <CardDescription>Breakdown of incidents by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} incidents`, 'Count']}
                      labelFormatter={(value) => `Severity: ${value}`}
                    />
                    <Bar dataKey="value" background={{ fill: "#f1f5f9" }} radius={[0, 4, 4, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Heatmap of crime incidents and hotspots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Interactive map view would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
