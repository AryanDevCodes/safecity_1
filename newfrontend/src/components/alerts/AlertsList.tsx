import React from 'react';
import { useAlerts } from '../../contexts/AlertsContext';
import AlertCard from './AlertCard';

const AlertsList = () => {
  const { alerts, markAsRead, clearAlert } = useAlerts();

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No alerts at the moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onMarkAsRead={markAsRead}
          onClear={clearAlert}
        />
      ))}
    </div>
  );
};

export default AlertsList;
