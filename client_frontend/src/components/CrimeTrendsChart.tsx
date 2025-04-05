import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from './ui/button';

// Mock data for crime trends
const mockCrimeData = [
  { month: 'Jan', theft: 65, accident: 28, suspicious: 40, total: 133 },
  { month: 'Feb', theft: 59, accident: 32, suspicious: 36, total: 127 },
  { month: 'Mar', theft: 80, accident: 40, suspicious: 45, total: 165 },
  { month: 'Apr', theft: 81, accident: 37, suspicious: 30, total: 148 },
  { month: 'May', theft: 56, accident: 25, suspicious: 38, total: 119 },
  { month: 'Jun', theft: 55, accident: 29, suspicious: 43, total: 127 }
];

interface CrimeTrendsChartProps {
  showOverallTrend?: boolean;
  className?: string;
}

const CrimeTrendsChart: React.FC<CrimeTrendsChartProps> = ({ showOverallTrend = false, className }) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>(showOverallTrend ? 'line' : 'bar');
  const [activeFilter, setActiveFilter] = useState<'all' | 'theft' | 'accident' | 'suspicious'>('all');
  
  // Filter data based on active filter
  const getFilteredData = () => {
    if (activeFilter === 'all') {
      return mockCrimeData;
    }
    
    return mockCrimeData.map(item => ({
      month: item.month,
      [activeFilter]: item[activeFilter]
    }));
  };
  
  const getOverallTrendText = (): string => {
    // Compare most recent month with average of previous months
    const lastMonth = mockCrimeData[mockCrimeData.length - 1];
    const prevMonths = mockCrimeData.slice(0, mockCrimeData.length - 1);
    const avgPrevTotal = prevMonths.reduce((sum, month) => sum + month.total, 0) / prevMonths.length;
    
    const percentChange = ((lastMonth.total - avgPrevTotal) / avgPrevTotal) * 100;
    
    if (percentChange > 5) {
      return `🔺 ${percentChange.toFixed(1)}% increase in crime incidents compared to previous months`;
    } else if (percentChange < -5) {
      return `🔽 ${Math.abs(percentChange).toFixed(1)}% decrease in crime incidents compared to previous months`;
    } else {
      return "⚖️ Crime rate is relatively stable compared to previous months";
    }
  };
  
  const getMostCommonCrime = () => {
    // Calculate most common crime type in last month
    const lastMonth = mockCrimeData[mockCrimeData.length - 1];
    const crimes = [
      { type: 'Theft', count: lastMonth.theft },
      { type: 'Accident', count: lastMonth.accident },
      { type: 'Suspicious', count: lastMonth.suspicious }
    ];
    
    crimes.sort((a, b) => b.count - a.count);
    return crimes[0].type;
  };
  
  return (
    <div className={className}>
      {showOverallTrend && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-raksha-secondary">Current Area Trend</h3>
          <p className="text-base mb-2">{getOverallTrendText()}</p>
          <p className="text-base mb-4">Most common incident type: <span className="font-medium">{getMostCommonCrime()}</span></p>
          <p className="text-sm text-gray-500">Based on data from the last 6 months in current area</p>
        </div>
      )}
      
      <div className="flex mb-3 space-x-2 ">
        <Button 
          size="sm"
          variant={chartType === 'bar' ? 'default' : 'outline'}
          className={chartType === 'bar' ? 'bg-raksha-primary h-8' : ''}
          onClick={() => setChartType('bar')}
        >
          Bar
        </Button>
        <Button 
          size="sm"
          variant={chartType === 'line' ? 'default' : 'outline'}
          className={chartType === 'line' ? 'bg-raksha-primary h-8' : ''}
          onClick={() => setChartType('line')}
        >
          Line
        </Button>
        <div className="ml-auto">
          <select 
            className="px-2 py-1 text-sm border rounded-md bg-white h-9"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
          >
            <option value="all">All Types</option>
            <option value="theft">Theft</option>
            <option value="accident">Accident</option>
            <option value="suspicious">Suspicious</option>
          </select>
        </div>
      </div>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={getFilteredData()}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              {(activeFilter === 'all' || activeFilter === 'theft') && 
                <Bar dataKey="theft" name="Theft" fill="#f43f5e" />}
              {(activeFilter === 'all' || activeFilter === 'accident') && 
                <Bar dataKey="accident" name="Accident" fill="#3b82f6" />}
              {(activeFilter === 'all' || activeFilter === 'suspicious') && 
                <Bar dataKey="suspicious" name="Suspicious" fill="#f59e0b" />}
            </BarChart>
          ) : (
            <LineChart
              data={getFilteredData()}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              {(activeFilter === 'all' || activeFilter === 'theft') && 
                <Line type="monotone" dataKey="theft" name="Theft" stroke="#f43f5e" activeDot={{ r: 8 }} />}
              {(activeFilter === 'all' || activeFilter === 'accident') && 
                <Line type="monotone" dataKey="accident" name="Accident" stroke="#3b82f6" activeDot={{ r: 8 }} />}
              {(activeFilter === 'all' || activeFilter === 'suspicious') && 
                <Line type="monotone" dataKey="suspicious" name="Suspicious" stroke="#f59e0b" activeDot={{ r: 8 }} />}
              {showOverallTrend && activeFilter === 'all' && 
                <Line type="monotone" dataKey="total" name="Total" stroke="#9333ea" strokeWidth={2} activeDot={{ r: 8 }} />}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrimeTrendsChart;
