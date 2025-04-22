import React from 'react';
import Navbar from '../components/layout/Navbar';
import { BarChart3 } from 'lucide-react';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-8 w-8 text-police-700 mr-2" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
