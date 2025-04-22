import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Mock data for demonstration
const incidentTrends = [
  { month: 'Jan', thefts: 65, assaults: 28, vandalism: 40 },
  { month: 'Feb', thefts: 59, assaults: 30, vandalism: 36 },
  { month: 'Mar', thefts: 80, assaults: 32, vandalism: 45 },
  { month: 'Apr', thefts: 81, assaults: 47, vandalism: 50 },
  { month: 'May', thefts: 56, assaults: 25, vandalism: 38 },
  { month: 'Jun', thefts: 55, assaults: 29, vandalism: 42 },
];

const responseTimeData = [
  { month: 'Jan', average: 12.3 },
  { month: 'Feb', average: 11.8 },
  { month: 'Mar', average: 10.5 },
  { month: 'Apr', average: 9.8 },
  { month: 'May', average: 8.9 },
  { month: 'Jun', average: 8.3 },
];

const incidentTypeData = [
  { name: 'Theft', value: 35 },
  { name: 'Assault', value: 20 },
  { name: 'Vandalism', value: 18 },
  { name: 'Drug-related', value: 15 },
  { name: 'Other', value: 12 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Incidents
            </CardTitle>
            <CardTitle className="text-2xl font-bold">
              4,291
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +8.2% from previous month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Response Time
            </CardTitle>
            <CardTitle className="text-2xl font-bold">
              8.3 min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              -0.6 min from previous month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solved Rate
            </CardTitle>
            <CardTitle className="text-2xl font-bold">
              67.8%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +2.1% from previous month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
          <TabsTrigger value="distribution">Incident Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
                      data={incidentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incidentTypeData.map((entry, index) => (
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
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
