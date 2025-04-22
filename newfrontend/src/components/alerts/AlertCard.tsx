import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { format } from "date-fns";
import { AlertTriangle, Info, Bell, Check } from "lucide-react";
import { Alert } from '../../contexts/AlertsContext';
import AlertBadge from './AlertBadge';
import { cn } from '../../lib/utils';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
}

const AlertCard = ({ alert, onMarkAsRead, onClear }: AlertCardProps) => {
  const icons = {
    emergency: AlertTriangle,
    warning: Bell,
    info: Info
  };

  const Icon = icons[alert.type];

  return (
    <Card className={cn(
      "transition-all duration-200",
      !alert.isRead && "border-l-4",
      !alert.isRead && alert.type === 'emergency' && "border-l-red-500",
      !alert.isRead && alert.type === 'warning' && "border-l-yellow-500",
      !alert.isRead && alert.type === 'info' && "border-l-blue-500"
    )}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex-1 flex items-center">
          <Icon className={cn(
            "h-5 w-5 mr-2",
            alert.type === 'emergency' && "text-red-500",
            alert.type === 'warning' && "text-yellow-500",
            alert.type === 'info' && "text-blue-500"
          )} />
          <h4 className="font-semibold text-sm">{alert.title}</h4>
        </div>
        <AlertBadge type={alert.type} className="ml-2" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{alert.message}</p>
        {alert.location && (
          <p className="text-xs text-gray-500 mt-1"> 📍 {alert.location}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <span className="text-xs text-gray-500">
          {format(alert.timestamp, 'PPp')}
        </span>
        <div className="flex gap-2">
          {!alert.isRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(alert.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Mark as read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClear(alert.id)}
          >
            Clear
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AlertCard;
