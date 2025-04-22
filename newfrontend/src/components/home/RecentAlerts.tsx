import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  AlertTriangle, 
  Clock, 
  MapPin 
} from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  location: string;
  time: string;
  status: 'active' | 'resolved';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'Theft',
    location: 'Main Street & 5th Avenue',
    time: '10 mins ago',
    status: 'active'
  },
  {
    id: '2',
    type: 'Suspicious Activity',
    location: 'Central Park, North Entrance',
    time: '25 mins ago',
    status: 'active'
  },
  {
    id: '3',
    type: 'Traffic Accident',
    location: 'Highway 101, Mile 25',
    time: '40 mins ago',
    status: 'resolved'
  },
  {
    id: '4',
    type: 'Vandalism',
    location: 'Downtown Shopping Mall',
    time: '1 hour ago',
    status: 'active'
  }
];

const RecentAlerts = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-emergency-500" />
            Recent Alerts
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            {mockAlerts.filter(a => a.status === 'active').length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className="flex flex-col space-y-2 pb-4 border-b last:border-0">
              <div className="flex justify-between items-start">
                <div className="font-medium">{alert.type}</div>
                <Badge 
                  variant={alert.status === 'active' ? 'destructive' : 'outline'} 
                  className="text-xs"
                >
                  {alert.status === 'active' ? 'Active' : 'Resolved'}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">{alert.location}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {alert.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAlerts;
