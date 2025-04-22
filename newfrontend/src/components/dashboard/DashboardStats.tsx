import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface DashboardStatsProps {
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ newCount, inProgressCount, resolvedCount }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <Card>
      <CardHeader>
        <CardTitle>New</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold text-yellow-700">{newCount}</span>
        <Badge className="ml-2 bg-yellow-100 text-yellow-800">New</Badge>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>In Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold text-blue-700">{inProgressCount}</span>
        <Badge className="ml-2 bg-blue-100 text-blue-800">In Progress</Badge>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Resolved</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold text-green-700">{resolvedCount}</span>
        <Badge className="ml-2 bg-green-100 text-green-800">Resolved</Badge>
      </CardContent>
    </Card>
  </div>
);

export default DashboardStats;
