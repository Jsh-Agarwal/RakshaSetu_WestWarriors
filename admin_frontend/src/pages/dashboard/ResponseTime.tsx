
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const dailyResponseTimeData = [
  { day: "Mon", responseTime: 4.8 },
  { day: "Tue", responseTime: 5.2 },
  { day: "Wed", responseTime: 4.5 },
  { day: "Thu", responseTime: 4.7 },
  { day: "Fri", responseTime: 3.8 },
  { day: "Sat", responseTime: 3.5 },
  { day: "Sun", responseTime: 3.9 },
];

const zoneResponseTimeData = [
  { zone: "North", responseTime: 4.2 },
  { zone: "South", responseTime: 3.8 },
  { zone: "East", responseTime: 5.1 },
  { zone: "West", responseTime: 4.6 },
  { zone: "Central", responseTime: 3.2 },
];

const teamResponseTimeData = [
  { team: "Alpha", responseTime: 3.2 },
  { team: "Bravo", responseTime: 3.8 },
  { team: "Charlie", responseTime: 4.5 },
  { team: "Delta", responseTime: 4.1 },
  { team: "Echo", responseTime: 5.2 },
];

const breakdownData = [
  { name: "Acknowledgment", value: 1.2, color: "#8884d8" },
  { name: "Dispatch", value: 1.4, color: "#82ca9d" },
  { name: "Travel", value: 1.6, color: "#ffc658" },
];

const ResponseTime: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Response Time</h1>
          <p className="text-muted-foreground">
            Analysis of emergency response performance
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">4.2 min</div>
              <Badge className="ml-2 bg-green-500">-12%</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Improvement from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Fastest Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.5 min</div>
            <p className="text-xs text-muted-foreground">Central Zone, Team Alpha</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Slowest Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7.8 min</div>
            <p className="text-xs text-muted-foreground">East Zone, Team Echo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily Trend</TabsTrigger>
          <TabsTrigger value="zone">Zone Comparison</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="breakdown">Response Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Response Time Trend</CardTitle>
              <CardDescription>Average response time by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyResponseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 6]} />
                    <Tooltip formatter={(value) => `${value} minutes`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      name="Response Time" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="zone" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Zone-wise Response Time</CardTitle>
              <CardDescription>Average response time by geographic zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneResponseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis domain={[0, 6]} />
                    <Tooltip formatter={(value) => `${value} minutes`} />
                    <Legend />
                    <Bar dataKey="responseTime" name="Response Time" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Average response time by response team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamResponseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" />
                    <YAxis domain={[0, 6]} />
                    <Tooltip formatter={(value) => `${value} minutes`} />
                    <Legend />
                    <Bar dataKey="responseTime" name="Response Time" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Breakdown</CardTitle>
              <CardDescription>Time distribution across response phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value} min`}
                      >
                        {breakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} minutes`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phase</TableHead>
                        <TableHead>Avg. Time</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span>Acknowledgment</span>
                        </TableCell>
                        <TableCell>1.2 min</TableCell>
                        <TableCell>
                          <Badge variant="outline">28.6%</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span>Dispatch Time</span>
                        </TableCell>
                        <TableCell>1.4 min</TableCell>
                        <TableCell>
                          <Badge variant="outline">33.3%</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>Travel Time</span>
                        </TableCell>
                        <TableCell>1.6 min</TableCell>
                        <TableCell>
                          <Badge variant="outline">38.1%</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseTime;
