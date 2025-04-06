
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  MoreVertical, 
  Search, 
  Shield, 
  AlertTriangle, 
  Ban, 
  UserPlus 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import UserForm from "@/components/forms/UserForm";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalReports: number;
  credibilityScore: number;
  status: "active" | "warned" | "suspended" | "banned";
  joinDate: string;
  lastActive: string;
  role: "citizen" | "police" | "admin";
}

// Initial users data
const initialUsers: User[] = [
  {
    id: "RST-U1234",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    totalReports: 17,
    credibilityScore: 92,
    status: "active",
    joinDate: "2024-10-15",
    lastActive: "2025-04-04",
    role: "citizen",
  },
  {
    id: "RST-U2345",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+91 87654 32109",
    totalReports: 8,
    credibilityScore: 85,
    status: "active",
    joinDate: "2024-11-23",
    lastActive: "2025-04-05",
    role: "citizen",
  },
  {
    id: "RST-U3456",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 76543 21098",
    totalReports: 25,
    credibilityScore: 78,
    status: "warned",
    joinDate: "2024-08-05",
    lastActive: "2025-04-03",
    role: "citizen",
  },
  {
    id: "RST-U4567",
    name: "Neha Patel",
    email: "neha.patel@example.com",
    phone: "+91 65432 10987",
    totalReports: 12,
    credibilityScore: 90,
    status: "active",
    joinDate: "2024-12-18",
    lastActive: "2025-04-05",
    role: "citizen",
  },
  {
    id: "RST-U5678",
    name: "Rajesh Gupta",
    email: "rajesh.gupta@example.com",
    phone: "+91 54321 09876",
    totalReports: 5,
    credibilityScore: 65,
    status: "suspended",
    joinDate: "2025-01-08",
    lastActive: "2025-03-15",
    role: "citizen",
  },
  {
    id: "RST-P1001",
    name: "Insp. Suresh Mehta",
    email: "suresh.mehta@police.gov.in",
    phone: "+91 98745 67890",
    totalReports: 45,
    credibilityScore: 98,
    status: "active",
    joinDate: "2024-06-10",
    lastActive: "2025-04-05",
    role: "police",
  },
  {
    id: "RST-A0001",
    name: "Admin Rohit Sharma",
    email: "rohit.sharma@rakshasetu.org",
    phone: "+91 98765 43210",
    totalReports: 0,
    credibilityScore: 100,
    status: "active",
    joinDate: "2024-05-01",
    lastActive: "2025-04-05",
    role: "admin",
  },
];

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Store users in localStorage for persistence
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);
  
  // Update localStorage whenever users change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleAction = (action: string, user: User) => {
    let newStatus: "active" | "warned" | "suspended" | "banned";
    
    switch (action) {
      case "Warned":
        newStatus = "warned";
        break;
      case "Suspended":
        newStatus = "suspended";
        break;
      case "Banned":
        newStatus = "banned";
        break;
      case "Reactivated":
        newStatus = "active";
        break;
      default:
        newStatus = user.status;
    }
    
    // Update user status
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    
    toast({
      title: `User ${action}`,
      description: `${user.name} (${user.id}) has been ${action.toLowerCase()}.`
    });
  };
  
  const addNewUser = (userData: any) => {
    const newUsers = [...users, userData];
    setUsers(newUsers);
    setIsUserFormOpen(false);
    
    toast({
      title: "User Added",
      description: `${userData.name} has been added successfully.`
    });
  };
  
  const filterUsers = (roleFilter: string) => {
    setActiveFilter(roleFilter);
  };
  
  const filteredUsers = users.filter(user => {
    // Apply search query filter
    const matchesQuery = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Apply role filter if not "all"
    const matchesFilter = activeFilter === "all" || user.role === activeFilter;
    
    return matchesQuery && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "warned":
        return <Badge className="bg-yellow-100 text-yellow-800">Warned</Badge>;
      case "suspended":
        return <Badge className="bg-orange-100 text-orange-800">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case "police":
        return <Badge className="bg-blue-100 text-blue-800">Police</Badge>;
      case "citizen":
        return <Badge className="bg-gray-100 text-gray-800">Citizen</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, permissions, and account status
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => filterUsers("all")} 
                className={activeFilter === "all" ? "bg-accent" : ""}>
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => filterUsers("citizen")}
                className={activeFilter === "citizen" ? "bg-accent" : ""}>
                Citizens
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => filterUsers("police")}
                className={activeFilter === "police" ? "bg-accent" : ""}>
                Police Officers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => filterUsers("admin")}
                className={activeFilter === "admin" ? "bg-accent" : ""}>
                Administrators
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="gap-2" onClick={() => setIsUserFormOpen(true)}>
            <UserPlus className="h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Reports Filed</TableHead>
                  <TableHead className="hidden md:table-cell">Credibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.totalReports}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-[60px] rounded-full bg-gray-200 overflow-hidden`}>
                          <div 
                            className={`h-full ${
                              user.credibilityScore > 90 ? 'bg-green-500' : 
                              user.credibilityScore > 75 ? 'bg-blue-500' : 
                              user.credibilityScore > 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${user.credibilityScore}%` }}
                          ></div>
                        </div>
                        <span>{user.credibilityScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "View Profile",
                              description: `Viewing profile for ${user.name}`
                            });
                          }}>
                            View Profile
                          </DropdownMenuItem>
                          
                          {user.role !== "admin" && (
                            <>
                              <DropdownMenuItem onClick={() => handleAction("Warned", user)}>
                                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" /> Warn
                              </DropdownMenuItem>
                              
                              {user.status !== "suspended" ? (
                                <DropdownMenuItem onClick={() => handleAction("Suspended", user)}>
                                  <Shield className="mr-2 h-4 w-4 text-orange-600" /> Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleAction("Reactivated", user)}>
                                  <Shield className="mr-2 h-4 w-4 text-green-600" /> Reactivate
                                </DropdownMenuItem>
                              )}
                              
                              {user.status !== "banned" && (
                                <DropdownMenuItem onClick={() => handleAction("Banned", user)}>
                                  <Ban className="mr-2 h-4 w-4 text-red-600" /> Ban
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UserForm 
        open={isUserFormOpen} 
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={addNewUser}
      />
    </div>
  );
};

export default UserManagement;
