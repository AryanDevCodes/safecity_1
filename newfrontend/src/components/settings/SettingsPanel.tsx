
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bell, Moon, Palette, Shield, User, Globe, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const SettingsPanel = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  
  const handleSettingSaved = () => {
    toast({
      title: "Settings updated",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const handleDarkModeToggle = () => {
    toast({
      title: "Dark Mode Setting Changed",
      description: "Your theme preference has been updated.",
    });
  };
  
  const handleColorThemeChange = (value: string) => {
    toast({
      title: "Color Theme Changed",
      description: `Your color theme has been updated to ${value}.`,
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Exporting User Data",
      description: "Your data is being prepared for download.",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full h-auto p-0 bg-gray-100 rounded-t-lg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white rounded-none rounded-tl-lg py-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white rounded-none py-3 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-white rounded-none py-3 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          
          {/* Only show Security tab for officers and admins */}
          {(role === 'officer' || role === 'admin') && (
            <TabsTrigger value="security" className="data-[state=active]:bg-white rounded-none py-3 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          )}
          
          {/* Only show System tab for admins */}
          {role === 'admin' && (
            <TabsTrigger value="system" className="data-[state=active]:bg-white rounded-none py-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <ProfileSettings user={user} onSave={handleSettingSaved} />
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Privacy</CardTitle>
                <CardDescription>
                  Manage your personal data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="w-full sm:w-auto"
                >
                  Export My Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <NotificationSettings onSave={handleSettingSaved} />
        </TabsContent>
        
        <TabsContent value="appearance" className="p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize how Safe City looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch id="dark-mode" onCheckedChange={handleDarkModeToggle} />
                </div>
                
                <div className="space-y-3">
                  <Label>Color Theme</Label>
                  <RadioGroup 
                    defaultValue="blue" 
                    className="flex flex-col space-y-3"
                    onValueChange={handleColorThemeChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="blue" id="blue" />
                      <Label htmlFor="blue" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-police-700 mr-2"></div>
                        Blue (Default)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="green" id="green" />
                      <Label htmlFor="green" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-700 mr-2"></div>
                        Green
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="amber" id="amber" />
                      <Label htmlFor="amber" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-amber-700 mr-2"></div>
                        Amber
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="purple" id="purple" />
                      <Label htmlFor="purple" className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-purple-700 mr-2"></div>
                        Purple
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security tab for officers and admins */}
        {(role === 'officer' || role === 'admin') && (
          <TabsContent value="security" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage security settings for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="two-factor">Two-factor Authentication</Label>
                    </div>
                    <Switch id="two-factor" onCheckedChange={() => handleSettingSaved()} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="session-timeout">Auto-logout after inactivity</Label>
                    </div>
                    <Switch id="session-timeout" defaultChecked onCheckedChange={() => handleSettingSaved()} />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Session Timeout Duration</Label>
                    <select 
                      id="timeout-duration" 
                      onChange={() => handleSettingSaved()}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-orange-50 hover:bg-orange-100"
                      onClick={() => {
                        toast({
                          title: "Security Log Retrieved",
                          description: "Your recent account activities have been fetched.",
                        });
                      }}
                    >
                      View Security Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* System tab for admins only */}
        {role === 'admin' && (
          <TabsContent value="system" className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Global settings for the Safe City platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <Label htmlFor="public-map">Public Crime Map</Label>
                    </div>
                    <Switch id="public-map" defaultChecked onCheckedChange={() => handleSettingSaved()} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="auto-alerts">Automated Alert System</Label>
                    </div>
                    <Switch id="auto-alerts" defaultChecked onCheckedChange={() => handleSettingSaved()} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <Label htmlFor="require-approval">Require Report Approval</Label>
                    </div>
                    <Switch id="require-approval" onCheckedChange={() => handleSettingSaved()} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Configure data retention policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="data-retention">Data retention period</Label>
                    <select 
                      id="data-retention" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={() => handleSettingSaved()}
                    >
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">6 months</option>
                      <option value="365">1 year</option>
                      <option value="730">2 years</option>
                      <option value="0">Indefinite</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        toast({
                          title: "Action Required",
                          description: "This action requires administrative password. Please check your email for verification.",
                          variant: "destructive"
                        });
                      }}
                    >
                      Clear Inactive User Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
