import React, { useState } from 'react';
import { Button } from '../ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from '../../contexts/AuthContext';
import { sosService } from '../../services/api';

interface Location {
  lat: number;
  lng: number;
}

const SOSButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleSOSClick = () => {
    setShowConfirmation(true);
  };

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Could not get your location: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  const sendSOSAlert = async () => {
    setIsLoading(true);

    try {
      const location = await getCurrentLocation();

      await sosService.triggerSOS(location, 'Emergency alert triggered by ' + (isAuthenticated ? user?.name : 'anonymous user'));

      toast({
        title: "Emergency Alert Sent",
        description: "Your location has been shared with nearby authorities.",
        variant: "default",
      });

      // Close the confirmation dialog
      setShowConfirmation(false);
    } catch (error) {
      console.error('SOS Alert failed:', error);
      toast({
        title: "Failed to send alert",
        description: error instanceof Error ? error.message : "Please try again or call emergency services directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          onClick={handleSOSClick}
          size="icon"
          className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="h-8 w-8 animate-pulse" />
        </Button>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Confirm Emergency Alert
            </DialogTitle>
            <DialogDescription>
              This will send an emergency alert to nearby authorities with your current location.
              {!isAuthenticated && (
                <p className="mt-2 text-yellow-600">
                  Note: You are not logged in. The alert will be sent anonymously.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-700">
              Please confirm that you want to send an emergency SOS alert. This should only be used in genuine emergencies.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={sendSOSAlert}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Emergency Alert'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
