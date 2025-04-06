
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  { day: "Mon", violent: 12, theft: 18, vandalism: 5, others: 8 },
  { day: "Tue", violent: 19, theft: 15, vandalism: 7, others: 10 },
  { day: "Wed", violent: 15, theft: 12, vandalism: 9, others: 5 },
  { day: "Thu", violent: 13, theft: 20, vandalism: 4, others: 7 },
  { day: "Fri", violent: 18, theft: 25, vandalism: 8, others: 12 },
  { day: "Sat", violent: 24, theft: 30, vandalism: 12, others: 15 },
  { day: "Sun", violent: 20, theft: 26, vandalism: 10, others: 13 },
];

const CrimeLineChart: React.FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daily Crimes Reported</CardTitle>
          <CardDescription>Total incidents reported by category</CardDescription>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
  );
};

export default CrimeLineChart;
