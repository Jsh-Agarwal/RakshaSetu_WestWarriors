
import { toast } from "@/hooks/use-toast";

// Generate report based on type and return data
export const generateReport = (type: string, period?: string) => {
  // Simulating report generation with mock data
  const reportData = {
    id: Math.floor(Math.random() * 10000),
    type,
    generatedAt: new Date().toISOString(),
    period: period || "Last 30 days",
    summary: `Summary of ${type} report for ${period || "Last 30 days"}`,
    data: {
      incidents: Math.floor(Math.random() * 100),
      resolved: Math.floor(Math.random() * 80),
      pending: Math.floor(Math.random() * 20),
      critical: Math.floor(Math.random() * 10),
    }
  };
  
  toast({
    title: "Report Generated",
    description: `${type} report has been generated successfully.`
  });
  
  return reportData;
};

// Export report as CSV function
export const exportReport = (type: string) => {
  // Simulate export process
  setTimeout(() => {
    toast({
      title: "Report Exported",
      description: `${type} report has been exported as CSV file.`
    });
  }, 800);
};

// Generate mock activity log data
export const getActivityLog = () => {
  return [
    { id: 1, user: "Officer Singh", action: "Dispatched team", timestamp: "Today, 14:23" },
    { id: 2, user: "Admin Sharma", action: "Generated report", timestamp: "Today, 13:05" },
    { id: 3, user: "Operator Patel", action: "Updated incident #4532", timestamp: "Today, 11:30" },
    { id: 4, user: "Officer Khan", action: "Closed alert #7823", timestamp: "Yesterday, 18:45" },
    { id: 5, user: "Admin Gupta", action: "Added new user", timestamp: "Yesterday, 16:20" },
  ];
};

// Generate crime timeline data
export const generateCrimeTimeline = () => {
  return [
    { period: "Jan", incidents: 65 },
    { period: "Feb", incidents: 59 },
    { period: "Mar", incidents: 80 },
    { period: "Apr", incidents: 81 },
    { period: "May", incidents: 56 },
    { period: "Jun", incidents: 55 },
    { period: "Jul", incidents: 40 },
    { period: "Aug", incidents: 70 },
    { period: "Sep", incidents: 90 },
    { period: "Oct", incidents: 75 },
    { period: "Nov", incidents: 62 },
    { period: "Dec", incidents: 58 },
  ];
};

// Generate period comparison data
export const generatePeriodComparison = () => {
  return {
    current: {
      total: 245,
      resolved: 180,
      pending: 65,
      critical: 28,
    },
    previous: {
      total: 218,
      resolved: 172,
      pending: 46,
      critical: 32,
    }
  };
};

// Generate crime hotspot data
export const generateHotspotItinerary = () => {
  return [
    { day: "Monday", location: "Gandhi Nagar Market", intensity: "High", timings: "10:00 - 14:00", team: "Team A" },
    { day: "Tuesday", location: "Central Railway Station", intensity: "Very High", timings: "16:00 - 20:00", team: "Team B" },
    { day: "Wednesday", location: "Laxmi Road", intensity: "Medium", timings: "12:00 - 16:00", team: "Team C" },
    { day: "Thursday", location: "University Campus", intensity: "Medium", timings: "14:00 - 18:00", team: "Team A" },
    { day: "Friday", location: "Night Market Area", intensity: "High", timings: "18:00 - 22:00", team: "Team D" },
    { day: "Saturday", location: "Shopping Mall Complex", intensity: "Very High", timings: "15:00 - 21:00", team: "Team B & C" },
    { day: "Sunday", location: "Temple Road", intensity: "High", timings: "08:00 - 12:00", team: "Team D" },
  ];
};
