
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Theft", value: 35, color: "#0ea5e9" },
  { name: "Assault", value: 20, color: "#ef4444" },
  { name: "Vandalism", value: 15, color: "#eab308" },
  { name: "Fraud", value: 12, color: "#8b5cf6" },
  { name: "Others", value: 18, color: "#6b7280" },
];

const COLORS = data.map(d => d.color);

const CrimeCategoriesPieChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crime Categories</CardTitle>
        <CardDescription>Distribution by incident type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value} reports`} 
                contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrimeCategoriesPieChart;
