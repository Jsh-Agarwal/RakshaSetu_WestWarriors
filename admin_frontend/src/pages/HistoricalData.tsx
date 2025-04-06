
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ReportViewer from "../components/dashboard/ReportViewer";
import { generateCrimeTimeline, generatePeriodComparison } from "../utils/reportUtils";

const HistoricalData = () => {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [periodData, setPeriodData] = useState<any>(null);
  const [dataGenerated, setDataGenerated] = useState(false);
  
  const handleGenerateData = () => {
    // Generate data for timeline and period comparison
    const timeline = generateCrimeTimeline();
    const periodComparison = generatePeriodComparison();
    
    setTimelineData(timeline);
    setPeriodData(periodComparison);
    setDataGenerated(true);
    
    toast({
      title: "Data Generated",
      description: "Historical crime data has been generated successfully.",
    });
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Historical Data</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateData}>Generate Data</Button>
          <ReportViewer reportType="Historical" />
        </div>
      </div>
      
      {!dataGenerated ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              Click on "Generate Data" button to view crime statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Button onClick={handleGenerateData}>Generate Data</Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Crime Timeline</TabsTrigger>
            <TabsTrigger value="comparison">Period Comparison</TabsTrigger>
            <TabsTrigger value="heatmap">Crime Heatmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Crime Timeline</CardTitle>
                <CardDescription>
                  Monthly crime incidents over the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="incidents" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Period Comparison</CardTitle>
                <CardDescription>
                  Comparison between current and previous period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {periodData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={[
                        {
                          name: 'Total',
                          Current: periodData.current.total,
                          Previous: periodData.previous.total,
                        },
                        {
                          name: 'Resolved',
                          Current: periodData.current.resolved,
                          Previous: periodData.previous.resolved,
                        },
                        {
                          name: 'Pending',
                          Current: periodData.current.pending,
                          Previous: periodData.previous.pending,
                        },
                        {
                          name: 'Critical',
                          Current: periodData.current.critical,
                          Previous: periodData.previous.critical,
                        },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Current" fill="#8884d8" />
                      <Bar dataKey="Previous" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="heatmap" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Crime Heatmap</CardTitle>
                <CardDescription>
                  Geographical distribution of crime incidents
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto w-full max-w-lg h-[350px] bg-slate-200 rounded-md mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/30 to-green-500/20 rounded-md"></div>
                    <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-red-500/60 rounded-full blur-md"></div>
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-red-600/60 rounded-full blur-md"></div>
                    <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-orange-500/60 rounded-full blur-md"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-500/60 rounded-full blur-md"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-12 h-12 bg-yellow-500/60 rounded-full blur-md"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-800 font-medium z-10">Interactive map with heat zones</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Red areas indicate high crime density, yellow for medium, and green for low
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default HistoricalData;
