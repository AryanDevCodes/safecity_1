import React from 'react';
import { FileText, MapPin, Calendar, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface Report {
  id: string;
  type: string;
  location: string;
  date: string;
  status: string;
  priority: string;
  district: string;
  complainant: string;
  contactNumber?: string;
  details?: string;
}

interface DashboardReportListProps {
  reports: Report[];
  handleReportAction: (report: Report, action: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
}

const DashboardReportList: React.FC<DashboardReportListProps> = ({ reports, handleReportAction, getStatusBadge, getPriorityBadge }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>Recent Reports</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No reports found</div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="flex items-start justify-between p-3 border rounded-md">
              <div className="flex items-start space-x-3">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">{report.type}</h4>
                    <div className="ml-2">{getPriorityBadge(report.priority)}</div>
                    <div className="ml-2">{getStatusBadge(report.status)}</div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground flex flex-col space-y-1">
                    <div className="flex items-center"><FileText className="mr-1 h-3 w-3" /><span>{report.id}</span></div>
                    <div className="flex items-center"><MapPin className="mr-1 h-3 w-3" /><span>{report.location} ({report.district})</span></div>
                    <div className="flex items-center"><Calendar className="mr-1 h-3 w-3" /><span>{new Date(report.date).toLocaleString('en-IN')}</span></div>
                    <div className="flex items-center"><User className="mr-1 h-3 w-3" /><span>Complainant: {report.complainant}</span></div>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleReportAction(report, 'details')}>Details</Button>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

export default DashboardReportList;
