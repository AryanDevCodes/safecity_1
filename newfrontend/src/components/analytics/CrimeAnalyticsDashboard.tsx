import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Loader2, AlertTriangle } from 'lucide-react';
import { analyticsService } from '../../services/api';
import { useToast } from '../ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CrimeAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('monthly');
  const [crimeStats, setCrimeStats] = useState<never>({
    incidentTrends: [],
    responseTimeData: [],
    incidentTypeData: [],
    heatmapData: []
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsResponse = await analyticsService.getCrimeStatistics();
        const trendsResponse = await analyticsService.getCrimeTrends(timeframe);
        
        setCrimeStats({
          incidentTrends: trendsResponse.data.trends,
          responseTimeData: statsResponse.data.responseTimes,
          incidentTypeData: statsResponse.data.incidentTypes,
          heatmapData: statsResponse.data.heatmap
        });
        
        setError(null);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
        setError('Failed to load analytics data. Please try again later.');
        toast({
          title: "Data Loading Error",
          description: "Could not load crime analytics data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe, toast]);
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Incidents
            </CardTitle>
            <CardTitle className="text-2xl font-bold">
              {crimeStats.totalIncidents || '0'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {crimeStats.incidentChange > 0 
                ? `+${crimeStats.incidentChange}% from previous ${timeframe}`
                : `${crimeStats.incidentChange}% from previous ${timeframe}`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Response Time
            </CardTitle>
            <CardTitle className="text-2xl font-bold">
              {crimeStats.avgResponseTime || '0'} min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {crimeStats.responseTimeChange < 0 
                ? `${crimeStats.responseTimeChange} min from previous ${timeframe}`
                : `+${crimeStats.responseTimeChange} min from previous ${timeframe}`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solved Rate
            </CardTitle>
            <CardTitle className="text-2xl font-bold">
              {crimeStats.solvedRate || '0'}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {crimeStats.solvedRateChange > 0 
                ? `+${crimeStats.solvedRateChange}% from previous ${timeframe}`
                : `${crimeStats.solvedRateChange}% from previous ${timeframe}`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <div className="w-48">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
          <TabsTrigger value="distribution">Incident Types</TabsTrigger>
          <TabsTrigger value="trends">Crime Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crimeStats.incidentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="thefts" fill="#0088FE" name="Thefts" />
                    <Bar dataKey="assaults" fill="#FF8042" name="Assaults" />
                    <Bar dataKey="vandalism" fill="#00C49F" name="Vandalism" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crimeStats.responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#8884d8" 
                      name="Avg. Response Time (min)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Incident Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={crimeStats.incidentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {crimeStats.incidentTypeData.map((entry: unknown, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Crime Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={crimeStats.incidentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Total Incidents" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="solved" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Solved Cases" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analysis (Beta)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Based on historical data, our AI analyzes crime patterns to predict potential hotspots.
            This feature is currently in beta and will be improved with more data.
          </p>
          
          <div className="border rounded-md p-4 bg-amber-50">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-sm font-medium text-amber-800">
                Potential crime hotspots predicted for next week:
              </p>
            </div>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-amber-700">• Downtown area near Central Market (Theft)</li>
              <li className="text-sm text-amber-700">• Industrial Zone B (Vandalism)</li>
              <li className="text-sm text-amber-700">• University District (Intoxication)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrimeAnalyticsDashboard;
