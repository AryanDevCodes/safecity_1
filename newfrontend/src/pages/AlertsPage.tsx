import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, MapPin, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert } from '@/types/alert';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SoundControl } from '@/components/ui/SoundControl';
import { soundManager } from '@/lib/soundUtils';

const AlertsPage = () => {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Alert[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<Alert[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { send } = useWebSocket({
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'SOS_ALERT':
          handleNewAlert(message.payload);
          soundManager.play('emergency');
          break;
        case 'ALERT_STATUS_UPDATE':
          handleAlertStatusUpdate(message.payload);
          soundManager.play('notification');
          break;
        case 'NEARBY_INCIDENT':
          handleNearbyIncident(message.payload);
          soundManager.play('notification');
          break;
      }
    },
  });

  const handleNewAlert = (alert: Alert) => {
    setActiveAlerts(prev => [alert, ...prev]);
    toast({
      title: "Emergency Alert!",
      description: `Emergency reported at ${alert.location}`,
      variant: "destructive",
    });
  };

  const handleNearbyIncident = (incident: any) => {
    toast({
      title: "New Incident Nearby",
      description: `${incident.type} reported ${incident.distance.toFixed(1)}km away`,
      variant: "default",
    });
  };

  const handleAlertStatusUpdate = (update: { alertId: string; status: string; officerId: string }) => {
    const updateAlertInList = (alerts: Alert[]) =>
      alerts.map(alert =>
        alert.id === update.alertId
          ? { ...alert, status: update.status, respondingOfficerId: update.officerId }
          : alert
      );

    setActiveAlerts(prev => prev.filter(alert => alert.id !== update.alertId));

    if (update.status === 'ACKNOWLEDGED') {
      setAcknowledgedAlerts(prev => updateAlertInList(prev));
    } else if (update.status === 'RESOLVED') {
      setResolvedAlerts(prev => updateAlertInList(prev));
    }
  };

  const handleRespondToAlert = async (alertId: string) => {
    try {
      send({
        type: 'ALERT_ACKNOWLEDGE',
        payload: {
          alertId,
          officerId: user?.id,
        },
      });

      toast({
        title: "Response Confirmed",
        description: "You have been assigned to this emergency",
      });

      // Navigate to the map showing the alert location
      navigate('/map', { state: { alertId } });
    } catch (error) {
      console.error('Failed to respond to alert:', error);
      toast({
        title: "Error",
        description: "Failed to respond to alert",
        variant: "destructive",
      });
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      send({
        type: 'ALERT_RESOLVE',
        payload: {
          alertId,
          officerId: user?.id,
        },
      });

      toast({
        title: "Alert Resolved",
        description: "Emergency has been marked as resolved",
      });
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Alerts</h1>
        <div className="flex items-center space-x-4">
          <SoundControl />
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">
              {activeAlerts.length} Active Alerts
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" className="relative">
            Active
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <AlertList
            alerts={activeAlerts}
            onRespond={handleRespondToAlert}
            onResolve={handleResolveAlert}
            type="active"
          />
        </TabsContent>

        <TabsContent value="acknowledged">
          <AlertList
            alerts={acknowledgedAlerts}
            onRespond={handleRespondToAlert}
            onResolve={handleResolveAlert}
            type="acknowledged"
          />
        </TabsContent>

        <TabsContent value="resolved">
          <AlertList
            alerts={resolvedAlerts}
            onRespond={handleRespondToAlert}
            onResolve={handleResolveAlert}
            type="resolved"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AlertListProps {
  alerts: Alert[];
  onRespond: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  type: 'active' | 'acknowledged' | 'resolved';
}

const AlertList: React.FC<AlertListProps> = ({ alerts, onRespond, onResolve, type }) => {
  if (alerts.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No {type} alerts
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="font-semibold">
              Emergency Alert
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-1" />
              <span>
                {alert.location}
              </span>
            </div>

            <div className="text-sm text-gray-500">
              Reported: {format(new Date(alert.createdAt), 'PPp')}
            </div>

            {alert.details && (
              <p className="text-sm">{alert.details}</p>
            )}

            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${type === 'active' ? 'bg-red-100 text-red-800' :
                type === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                {type.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-x-2">
            {type === 'active' && (
              <Button
                onClick={() => onRespond(alert.id)}
                variant="default"
              >
                Respond
              </Button>
            )}

            {type === 'acknowledged' && (
              <Button
                onClick={() => onResolve(alert.id)}
                variant="outline"
              >
                Mark Resolved
              </Button>
            )}

            {type === 'resolved' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolved
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AlertsPage;
