import React from 'react';
import Navbar from '../components/layout/Navbar';
import AlertsList from '../components/alerts/AlertsList';
import { Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAlerts } from '../contexts/AlertsContext';

const AlertsPage = () => {
  const { addAlert } = useAlerts();

  // Demo function to add test alerts
  const addTestAlert = () => {
    const types = ['emergency', 'warning', 'info'] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    
    addAlert({
      type,
      title: `Test ${type} Alert`,
      message: `This is a test ${type} alert message.`,
      location: 'Test Location'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-amber-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Alerts Center</h1>
            </div>
            <Button onClick={addTestAlert}>
              Add Test Alert
            </Button>
          </div>
          <AlertsList />
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
