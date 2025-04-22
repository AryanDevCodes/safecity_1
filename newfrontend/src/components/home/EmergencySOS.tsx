import React from 'react';
import SOSButton from '../sos/SOSButton';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

const EmergencySOS = () => {
  return (
    <div className="relative">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              In case of emergency, use the SOS button at the bottom right of the page or call <strong>112</strong>.
            </p>
          </div>
        </div>
      </div>
      <SOSButton />
    </div>
  );
};

export default EmergencySOS;
