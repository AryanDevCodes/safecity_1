import React from 'react';
import Navbar from '../components/layout/Navbar';
import IncidentMap from '../components/map/IncidentMap';
import { AlertTriangle } from 'lucide-react';

const IncidentsPage = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <AlertTriangle className="h-8 w-8 text-orange-700 mr-2" />
          <h1 className="text-2xl font-bold text-amber-900">
            Incident Monitoring System
          </h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-amber-200 shadow-sm mb-8">
          <p className="text-amber-800 mb-4">
            Monitor and track incidents across all districts. Use filters to focus on specific areas or incident types.
          </p>
          <IncidentMap />
        </div>
      </div>
    </div>
  );
};

export default IncidentsPage;
