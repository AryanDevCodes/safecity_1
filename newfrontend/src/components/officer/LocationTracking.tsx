import React, { useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LocationState {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}

const LocationTracking: React.FC = () => {
    const watchIdRef = useRef<number | null>(null);
    const { user } = useAuth();
    const { send } = useWebSocket({
        onConnect: () => {
            toast({
                title: "Connected",
                description: "Location tracking is now active",
            });
        },
        onDisconnect: () => {
            toast({
                title: "Disconnected",
                description: "Location tracking has stopped",
                variant: "destructive",
            });
        },
    });

    useEffect(() => {
        if (!user?.role || user.role !== 'officer') return;

        const startTracking = () => {
            if (!navigator.geolocation) {
                toast({
                    title: "Error",
                    description: "Geolocation is not supported by your browser",
                    variant: "destructive",
                });
                return;
            }

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const locationData: LocationState = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    };

                    send({
                        type: 'OFFICER_LOCATION_UPDATE',
                        payload: {
                            officerId: user.id,
                            ...locationData,
                        },
                    });
                },
                (error) => {
                    console.error('Location tracking error:', error);
                    toast({
                        title: "Location Error",
                        description: getLocationErrorMessage(error),
                        variant: "destructive",
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        };

        startTracking();

        // Cleanup function
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, [user, send]);

    const getLocationErrorMessage = (error: GeolocationPositionError): string => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return "Location permission was denied. Please enable location services to continue.";
            case error.POSITION_UNAVAILABLE:
                return "Location information is unavailable. Please try again.";
            case error.TIMEOUT:
                return "Location request timed out. Please try again.";
            default:
                return "An unknown error occurred while getting location.";
        }
    };

    return null; // This component doesn't render anything
};

export default LocationTracking;