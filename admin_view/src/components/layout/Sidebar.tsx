
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChartBig,
  Calendar,
  ChevronLeft,
  Globe,
  Home,
  LayoutDashboard,
  LineChart,
  List,
  Search,
  Settings,
  Shield,
  Siren,
  TimerReset,
  Users,
  X,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/e2b55797-81cb-4383-befc-7a99a055060f.png" alt="RakshaSetu Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">
              <span className="text-raksha-red">Raksha</span>
              <span className="text-raksha-blue">Setu</span>
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-4 py-3">
          <SidebarNavigation />
        </ScrollArea>
      </div>

      {/* Desktop sidebar */}
      <Sidebar className="hidden border-r md:block">
        <SidebarHeader className="flex items-center gap-2 px-4 py-3">
          <img src="/lovable-uploads/e2b55797-81cb-4383-befc-7a99a055060f.png" alt="RakshaSetu Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">
            <span className="text-raksha-red">Raksha</span>
            <span className="text-raksha-blue">Setu</span>
          </span>
          <SidebarTrigger className="ml-auto">
            <ChevronLeft className="h-5 w-5" />
          </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full px-4">
            <SidebarNavigation />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <p>RakshaSetu Admin v1.0</p>
              <p>© 2025 RakshaSetu</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

const SidebarNavigation = () => {
  const navigationItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/",
    },
    {
      title: "Live Crime Tracking",
      icon: <Globe className="h-4 w-4" />,
      path: "/live-tracking",
      badge: "Live",
    },
    {
      title: "Incident Management",
      icon: <List className="h-4 w-4" />,
      path: "/incidents",
      badge: "12 New",
    },
    {
      title: "Search & Reports",
      icon: <Search className="h-4 w-4" />,
      path: "/search",
    },
    {
      title: "Analytics",
      icon: <LineChart className="h-4 w-4" />,
      path: "/analytics",
    },
    {
      title: "Fake Reporter Detection",
      icon: <AlertTriangle className="h-4 w-4" />,
      path: "/fake-detection",
      badge: "3",
    },
    {
      title: "Historical Data",
      icon: <TimerReset className="h-4 w-4" />,
      path: "/historical-data",
    },
    {
      title: "Alerts & SOS",
      icon: <Siren className="h-4 w-4" />,
      path: "/alerts",
      badge: "2",
    },
    {
      title: "User Management",
      icon: <Users className="h-4 w-4" />,
      path: "/users",
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      path: "/settings",
    },
  ];

  return (
    <nav className="space-y-1 py-2">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )
          }
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.title}</span>
          </div>
          {item.badge && (
            <Badge
              variant={item.badge === "Live" ? "outline" : "default"}
              className={cn(
                item.badge === "Live" && "border-green-500 bg-green-500/10 text-green-500"
              )}
            >
              {item.badge}
            </Badge>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default AppSidebar;
