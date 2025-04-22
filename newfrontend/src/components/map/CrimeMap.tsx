import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { incidentService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Shield, AlertTriangle } from 'lucide-react';

interface MapIncident {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  status: string;
  timestamp: string;
}

interface OfficerLocation {
  officerId: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdate: number;
}

const CrimeMap: React.FC = () => {
  const [incidents, setIncidents] = useState<MapIncident[]>([]);
  const [officerLocations, setOfficerLocations] = useState<OfficerLocation[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapIncident | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const { user } = useAuth();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws?token=${localStorage.getItem('safecity_token')}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'NEW_INCIDENT':
          setIncidents(prev => [...prev, message.payload]);
          toast({
            title: "New Incident",
            description: `New incident reported at ${message.payload.location.lat}, ${message.payload.location.lng}`,
            variant: "default",
          });
          break;

        case 'OFFICER_LOCATION_UPDATE':
          setOfficerLocations(prev => {
            const index = prev.findIndex(o => o.officerId === message.payload.officerId);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                latitude: message.payload.latitude,
                longitude: message.payload.longitude,
                lastUpdate: Date.now(),
              };
              return updated;
            }
            return [...prev, {
              officerId: message.payload.officerId,
              name: message.payload.name || 'Officer',
              latitude: message.payload.latitude,
              longitude: message.payload.longitude,
              lastUpdate: Date.now(),
            }];
          });
          break;
      }
    };

    return () => ws.close();
  }, []);

  // Load initial incidents
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        if (mapBounds) {
          const bounds = {
            north: mapBounds.getNorthEast().lat(),
            south: mapBounds.getSouthWest().lat(),
            east: mapBounds.getNorthEast().lng(),
            west: mapBounds.getSouthWest().lng(),
          };
          const response = await incidentService.getIncidentsForMap(bounds);
          setIncidents(response.data);
        }
      } catch (error) {
        console.error('Failed to load incidents:', error);
        toast({
          title: "Error",
          description: "Failed to load incidents data",
          variant: "destructive",
        });
      }
    };

    loadIncidents();
  }, [mapBounds]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      zoom={5}
      center={mapCenter}
      mapContainerClassName="w-full h-[calc(100vh-4rem)]"
      options={{
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      }}
      onBoundsChanged={(map) => {
        if (map) setMapBounds(map.getBounds() || null);
      }}
    >
      {/* Render Incidents */}
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={incident.location}
          icon={{
            url: incident.type === 'EMERGENCY' ? '/markers/emergency.svg' : '/markers/incident.svg',
            scaledSize: new google.maps.Size(30, 30),
          }}
          onClick={() => setSelectedMarker(incident)}
        />
      ))}

      {/* Render Officer Locations */}
      {user?.role !== 'user' && officerLocations.map((officer) => (
        <Marker
          key={officer.officerId}
          position={{ lat: officer.latitude, lng: officer.longitude }}
          icon={{
            url: '/markers/officer.svg',
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
      ))}

      {/* Info Window for selected marker */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.location}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold">{selectedMarker.type}</h3>
            <p className="text-sm">{selectedMarker.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(selectedMarker.timestamp).toLocaleString()}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default CrimeMap;
