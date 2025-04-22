import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { incidentService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from 'react-error-boundary';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for different incident types
const customIcons = {
  theft: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  assault: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  vandalism: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  suspicious: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  default: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

interface Incident {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  date: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: string;
}

const LocationFinder = () => {
  const map = useMap();
  const { toast } = useToast();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not get your current location. Using default view.",
            variant: "destructive",
          });
        }
      );
    }
  }, [map, toast]);

  return null;
};

const BoundsUpdater = ({ onBoundsChanged }: { onBoundsChanged: (bounds: unknown) => void }) => {
  const map = useMap();

  const handleMoveEnd = useCallback(() => {
    const bounds = map.getBounds();
    onBoundsChanged({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    });
  }, [map, onBoundsChanged]);

  useEffect(() => {
    map.on('moveend', handleMoveEnd);
    handleMoveEnd(); // Initial bounds

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, handleMoveEnd]);

  return null;
};

const MapErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 text-center">
    <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
    <p className="text-sm text-gray-600 mb-4">{error.message}</p>
    <Button onClick={resetErrorBoundary}>Try Again</Button>
  </div>
);

const CrimeMap: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [mapBounds, setMapBounds] = useState<any>(null);
  const { toast } = useToast();

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await incidentService.getIncidentsForMap(mapBounds);
      setIncidents(response.data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      toast({
        title: "Data Loading Error",
        description: "Could not load incident data for the map.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [mapBounds, toast]);

  useEffect(() => {
    if (mapBounds) {
      fetchIncidents();
    }
  }, [mapBounds, fetchIncidents]);

  const handleBoundsChanged = (bounds: unknown) => {
    setMapBounds(bounds);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const getFilteredIncidents = () => {
    return incidents.filter(incident => {
      // Type filter
      if (filter !== 'all' && incident.type !== filter) {
        return false;
      }

      // Time range filter
      if (timeRange !== 'all') {
        const incidentDate = new Date(incident.date);
        const now = new Date();

        switch (timeRange) {
          case '24h':
            if (now.getTime() - incidentDate.getTime() > 24 * 60 * 60 * 1000) {
              return false;
            }
            break;
          case '7d':
            if (now.getTime() - incidentDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
              return false;
            }
            break;
          case '30d':
            if (now.getTime() - incidentDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
              return false;
            }
            break;
        }
      }

      return true;
    });
  };

  const filteredIncidents = getFilteredIncidents();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Crime Incident Map</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Incident Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="vandalism">Vandalism</SelectItem>
                <SelectItem value="suspicious">Suspicious</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] relative rounded-md overflow-hidden border">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />

            <BoundsUpdater onBoundsChanged={handleBoundsChanged} />

            {filteredIncidents.map(incident => (
              <Marker
                key={incident.id}
                position={[incident.coordinates.lat, incident.coordinates.lng]}
                icon={customIcons[incident.type as keyof typeof customIcons] || customIcons.default}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-medium text-base">{incident.title}</h3>
                    <div className="my-1">
                      <Badge variant={incident.status === 'resolved' ? 'outline' : 'default'}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(incident.date).toLocaleString()}</p>
                    <p className="text-sm my-1">{incident.description}</p>
                    <p className="text-xs">{incident.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <span className="text-xs">Theft</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            <span className="text-xs">Assault</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <span className="text-xs">Vandalism</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
            <span className="text-xs">Suspicious</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
            <span className="text-xs">Other</span>
          </div>
        </div>

        {filteredIncidents.length === 0 && !loading && (
          <div className="mt-4 text-center py-8 text-muted-foreground">
            No incidents found with the current filters.
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => {
                setFilter('all');
                setTimeRange('all');
              }}>
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrimeMap;
