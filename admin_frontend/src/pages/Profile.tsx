
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Amit Kumar",
    email: "amit.kumar@rakshasetu.gov.in",
    role: "Senior Administrator",
    department: "Central Command",
    phone: "+91 98765 43210",
    bio: "Senior administrator with over 10 years of experience in public safety management and emergency response coordination."
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://github.com/shadcn.png" alt={profile.name} />
                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{profile.name}</CardTitle>
              <CardDescription>{profile.role}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-sm">
              <p>{profile.department}</p>
              <p className="mt-2">{profile.email}</p>
              <p>{profile.phone}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update your profile information below" 
                : "Your personal and contact information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      name="role" 
                      value={formData.role} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      rows={4} 
                      value={formData.bio} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => {
                      setIsEditing(false);
                      setFormData({ ...profile });
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label>Full Name</Label>
                  <p>{profile.name}</p>
                </div>
                <div className="grid gap-1">
                  <Label>Email</Label>
                  <p>{profile.email}</p>
                </div>
                <div className="grid gap-1">
                  <Label>Role</Label>
                  <p>{profile.role}</p>
                </div>
                <div className="grid gap-1">
                  <Label>Department</Label>
                  <p>{profile.department}</p>
                </div>
                <div className="grid gap-1">
                  <Label>Phone</Label>
                  <p>{profile.phone}</p>
                </div>
                <div className="grid gap-1">
                  <Label>Bio</Label>
                  <p className="text-sm">{profile.bio}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
