
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { BarChart3, Blocks, Code, DatabaseBackup, PanelLeft, Palette, Shield, Sliders, Wrench } from "lucide-react";

const Settings: React.FC = () => {
  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings updated",
      description: `Your ${section} settings have been saved.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences and system settings
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" defaultValue="RakshaSetu - Safety & Crime Reporting" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Default Region</Label>
                <Input id="region" defaultValue="Delhi NCR" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="Asia/Kolkata (GMT+5:30)" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Anonymous Reporting</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow users to report incidents without providing personal information
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Enable SOS Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow users to send emergency SOS alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSaveSettings("general")}>Save changes</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="interface" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Interface Settings
              </CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for your dashboard
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Compact View</h3>
                  <p className="text-sm text-muted-foreground">
                    Show more content in less space
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Show live data updates on dashboard
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Collapsible Sidebar</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow sidebar to be collapsed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSaveSettings("interface")}>Save preferences</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sliders className="mr-2 h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system-level settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Enable AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Use AI to analyze and classify reports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Auto-backup Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup data daily
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-location">Backup Location</Label>
                <Input id="backup-location" defaultValue="s3://rakshasetu-backups/" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">System Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Send email alerts for system events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@rakshasetu.com" />
              </div>
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" className="flex items-center" onClick={() => toast({ title: "Backup started", description: "System backup process has been initiated" })}>
                <DatabaseBackup className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
              <Button onClick={() => handleSaveSettings("system")}>Save settings</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Session Timeout</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out inactive users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeout-minutes">Timeout (minutes)</Label>
                <Input id="timeout-minutes" type="number" defaultValue="30" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Data Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    Encrypt sensitive data at rest
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">IP Restriction</h3>
                  <p className="text-sm text-muted-foreground">
                    Limit access to specific IP addresses
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSaveSettings("security")}>Save security settings</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Manage API settings and access tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" defaultValue="rsk_3569d2c7f18b4e2a9b7d1e5f8c6a3b2d" type="password" />
                  <Button variant="secondary" onClick={() => toast({ title: "API Key copied", description: "API key has been copied to clipboard" })}>
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Enable API Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow external applications to access the API
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground">
                    Limit API request frequency
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate-limit">Requests per minute</Label>
                <Input id="rate-limit" type="number" defaultValue="100" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">CORS Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow cross-origin requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSaveSettings("API")}>Save API settings</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Blocks className="mr-2 h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>
                Configure third-party service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Map Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to Mapbox for map services
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mapbox-key">Mapbox API Key</Label>
                <Input id="mapbox-key" type="password" defaultValue="pk.eyJ1IjoicmFrc2hhc2V0dSIsImEiOiJjbHMzNGV1ODQwMGZpMm1vNHRvNnc5Y3RoIn0.8iUYmxMXEXUQ" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">SMS Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to Twilio for SMS alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to SendGrid for email notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Weather Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to OpenWeather API for weather data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Blockchain Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to blockchain for immutable records
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => handleSaveSettings("integrations")}>Save integration settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
