import  { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Map as MapIcon, Search, MapPin, FileDown, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define incident types
interface Incident {
  id: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  date: string;
  status: 'active' | 'resolved';
  createdAt?: string;
}

// Custom icons for different incident types
const getIncidentIcon = (type: string, status: 'active' | 'resolved') => {
  let iconUrl;
  
  if (status === 'resolved') {
    iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
  } else {
    switch (type) {
      case 'Theft':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
        break;
      case 'Assault':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
        break;
      case 'Vandalism':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
        break;
      case 'Suspicious Activity':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
        break;
      case 'Burglary':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png';
        break;
      case 'Traffic Incident':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
        break;
      case 'Noise Complaint':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png';
        break;
      default:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
    }
  }

  return new Icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Location search component
const LocationSearch = ({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a location to search",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would use a geocoding service
    // For demo purposes, we'll just use a random location near San Francisco
    const randomLat = 37.7749 + (Math.random() - 0.5) * 0.05;
    const randomLng = -122.4194 + (Math.random() - 0.5) * 0.05;
    
    onLocationFound(randomLat, randomLng);
    toast({
      title: "Location Found",
      description: `Showing results for "${searchTerm}"`,
    });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Search for a location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
      <Button variant="outline" size="icon" onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Map center updater component
const MapCenterUpdate = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  
  return null;
};

const IncidentMap = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // San Francisco
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  const zoom = 13;
  const { toast } = useToast();

  useEffect(() => {
    // Fetch incidents from backend
    fetch('/api/incidents?page=0&size=100')
      .then(res => res.json())
      .then(data => {
        // If paginated, data.content holds the array
        setIncidents(Array.isArray(data) ? data : data.content || []);
      })
      .catch(() => {
        toast({ title: 'Failed to load incidents', variant: 'destructive' });
      });
  }, []);

  // Filter incidents based on user selection
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const typeMatch = filters.type === 'all' || incident.type === filters.type;
      const statusMatch = filters.status === 'all' || incident.status === filters.status;
      let dateMatch = true;
      const dateStr = incident.date || incident.createdAt || '';
      const incidentDate = dateStr ? new Date(dateStr) : new Date();
      if (filters.dateRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateMatch = incidentDate >= today;
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateMatch = incidentDate >= weekAgo;
      } else if (filters.dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateMatch = incidentDate >= monthAgo;
      }
      return typeMatch && statusMatch && dateMatch;
    });
  }, [filters, incidents]);

  const handleLocationFound = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-3 lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="text-xl font-semibold flex items-center">
              <MapIcon className="mr-2 h-5 w-5 text-police-600" />
              Incident Map
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Badge variant="outline" className="md:ml-auto">
                {filteredIncidents.filter(i => i.status === 'active').length} Active Incidents
              </Badge>
              <Badge variant="outline">
                {filteredIncidents.filter(i => i.status === 'resolved').length} Resolved
              </Badge>
            </div>
          </div>
          
          <div className="mt-3 space-y-3">
            <LocationSearch onLocationFound={handleLocationFound} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters({...filters, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Array.from(new Set(incidents.map(i => i.type))).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value as 'all' | 'active' | 'resolved'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => setFilters({...filters, dateRange: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
            <MapContainer 
              center={mapCenter} 
              zoom={zoom} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapCenterUpdate center={mapCenter} />
              
              <MarkerClusterGroup chunkedLoading>
                {filteredIncidents
                  .filter(incident => typeof incident.lat === 'number' && typeof incident.lng === 'number')
                  .map((incident) => (
                    <Marker
                      key={incident.id}
                      position={[incident.lat, incident.lng]}
                      icon={getIncidentIcon(incident.type, incident.status)}
                      eventHandlers={{
                        click: () => {
                          setSelectedIncident(incident);
                        },
                      }}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-bold">{incident.type}</h3>
                          <p>{incident.description}</p>
                          <p className="text-xs mt-1">
                            {new Date(incident.date || incident.createdAt || '').toLocaleString()}
                          </p>
                          <Badge 
                            className="mt-2" 
                            variant={incident.status === 'active' ? 'destructive' : 'outline'}
                          >
                            {incident.status === 'active' ? 'Active' : 'Resolved'}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </CardContent>
        <CardFooter className="pt-3 pb-3 px-6 gap-2 flex-wrap justify-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Theft</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Assault</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Vandalism</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Suspicious</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
            <span>Burglary</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Traffic</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Resolved</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="md:col-span-3 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-emergency-500" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedIncident ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedIncident.type}</h3>
                <Badge 
                  className="mt-1" 
                  variant={selectedIncident.status === 'active' ? 'destructive' : 'outline'}
                >
                  {selectedIncident.status === 'active' ? 'Active' : 'Resolved'}
                </Badge>
              </div>
              <p>{selectedIncident.description}</p>
              <div className="text-sm text-muted-foreground">
                <div>Date: {new Date(selectedIncident.date || selectedIncident.createdAt || '').toLocaleDateString()}</div>
                <div>Time: {new Date(selectedIncident.date || selectedIncident.createdAt || '').toLocaleTimeString()}</div>
                <div>Coordinates: {selectedIncident.lat.toFixed(4)}, {selectedIncident.lng.toFixed(4)}</div>
              </div>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Officer Details</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-1">Assigned to:</h4>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-police-200 rounded-full flex items-center justify-center text-police-700 font-bold mr-2">
                        JD
                      </div>
                      <div>
                        <div className="text-sm font-medium">Officer J. Doe</div>
                        <div className="text-xs text-muted-foreground">Precinct: Central</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-1">Case Status:</h4>
                      <div className="text-sm">
                        <span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Case ID:</span> #{(parseInt(selectedIncident.id) + 10000).toString()}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="actions">
                  <div className="space-y-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Report Generated",
                          description: "Incident report has been generated and downloaded"
                        });
                      }}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Sharing Options",
                          description: "Share options dialog would appear here"
                        });
                      }}
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Share Incident
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setMapCenter([selectedIncident.lat, selectedIncident.lng]);
                        toast({
                          title: "Map Centered",
                          description: "Map has been centered on the incident location"
                        });
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Center on Map
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center h-64">
              <MapIcon className="h-12 w-12 mb-2 opacity-20" />
              <p>Select an incident on the map to view details</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * filteredIncidents.length);
                  if (filteredIncidents[randomIndex]) {
                    setSelectedIncident(filteredIncidents[randomIndex]);
                    setMapCenter([filteredIncidents[randomIndex].lat, filteredIncidents[randomIndex].lng]);
                  }
                }}
              >
                View Random Incident
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentMap;
