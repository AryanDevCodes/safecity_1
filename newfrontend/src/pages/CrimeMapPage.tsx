import React from 'react';
import Navbar from '../components/layout/Navbar';
import CrimeMap from '../components/map/CrimeMap';
import { MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

const CrimeMapPage = () => {
  const { permissions, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <MapPin className="h-8 w-8 text-orange-700 mr-2" />
          <h1 className="text-2xl font-bold">Crime Mapping System</h1>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Explore reported incidents across the city with our interactive crime mapping tool. 
            This visual representation helps identify patterns and hotspots.
            {permissions.canAccessAnalytics && (
              <span> Advanced analytics and predictive features are available for authorized personnel.</span>
            )}
          </p>
        </div>

        {!isAuthenticated && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sign in to access detailed crime statistics and personalized safety recommendations.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="shadow-sm">
          <CardHeader className="bg-white pb-0">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Crime Hotspots</h2>
              {permissions.canAccessAnalytics && (
                <div className="text-sm text-amber-600">
                  *Analytics Mode Enabled
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="h-[60vh]">
              <CrimeMap />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrimeMapPage;
