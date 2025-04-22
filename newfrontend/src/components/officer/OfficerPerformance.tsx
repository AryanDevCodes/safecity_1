import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface OfficerPerformanceProps {
  officerId: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
}

const OfficerPerformance: React.FC<OfficerPerformanceProps> = ({ officerId }) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await userService.getOfficerPerformance(officerId);
        setMetrics(response.data.metrics);
        setOverallRating(response.data.overallRating);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
        toast({
          title: "Data Loading Error",
          description: "Could not load officer performance data.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [officerId, toast]);

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return { label: 'Outstanding', color: 'bg-green-100 text-green-800' };
    if (rating >= 7) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (rating >= 5) return { label: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">Current: {payload[0].payload.value}</p>
          <p className="text-sm">Target: {payload[0].payload.target}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Officer Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // If we have no metrics, show a placeholder
  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Officer Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No performance data available for this officer.
          </p>
        </CardContent>
      </Card>
    );
  }

  const ratingInfo = overallRating ? getRatingLabel(overallRating) : { label: 'Not Rated', color: 'bg-gray-100 text-gray-800' };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle className="text-xl">Officer Performance</CardTitle>
          {overallRating && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Rating:</span>
              <Badge className={ratingInfo.color}>
                {ratingInfo.label} ({overallRating.toFixed(1)}/10)
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" name="Current" />
              <Bar dataKey="target" fill="#94a3b8" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-3 bg-muted rounded-md">
              <div className="text-sm font-medium">{metric.name}</div>
              <div className="mt-1 flex justify-between">
                <span>{metric.value}</span>
                <span className="text-muted-foreground">Target: {metric.target}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficerPerformance;
