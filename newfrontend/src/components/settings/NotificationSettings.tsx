
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationSettingsProps {
  onSave: () => void;
}

const NotificationSettings = ({ onSave }: NotificationSettingsProps) => {
  const { role } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this data to your backend
    console.log('Notification settings saved');
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>
              Choose how you'd like to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch id="sms-notifications" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Select which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Common notifications for all users */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nearby-incidents">Nearby Incidents</Label>
                </div>
                <Switch id="nearby-incidents" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="safety-alerts">Safety Alerts</Label>
                </div>
                <Switch id="safety-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="community-updates">Community Updates</Label>
                </div>
                <Switch id="community-updates" />
              </div>
            </div>
            
            {/* Officer and Admin specific notifications */}
            {(role === 'officer' || role === 'admin') && (
              <>
                <Separator />
                <h3 className="font-medium">Officer Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="new-reports">New Reports</Label>
                    </div>
                    <Switch id="new-reports" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="assignments">New Assignments</Label>
                    </div>
                    <Switch id="assignments" defaultChecked />
                  </div>
                </div>
              </>
            )}
            
            {/* Admin specific notifications */}
            {role === 'admin' && (
              <>
                <Separator />
                <h3 className="font-medium">Admin Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="system-alerts">System Alerts</Label>
                    </div>
                    <Switch id="system-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="user-management">User Management Updates</Label>
                    </div>
                    <Switch id="user-management" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="analytics-reports">Weekly Analytics Reports</Label>
                    </div>
                    <Switch id="analytics-reports" />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-police-700 hover:bg-police-800">
            Save Preferences
          </Button>
        </div>
      </div>
    </form>
  );
};

export default NotificationSettings;
