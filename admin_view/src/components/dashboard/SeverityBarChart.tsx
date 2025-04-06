
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "High", value: 24, color: "#f97316" },
  { name: "Medium", value: 53, color: "#eab308" },
  { name: "Low", value: 87, color: "#22c55e" },
];

const SeverityBarChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Breakdown</CardTitle>
        <CardDescription>Incidents by severity level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value: number) => [`${value} incidents`, 'Count']}
                labelFormatter={(value) => `Severity: ${value}`}
              />
              <Bar 
                dataKey="value" 
                background={{ fill: "#f1f5f9" }} 
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityBarChart;
