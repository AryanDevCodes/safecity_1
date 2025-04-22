import React from 'react';
import { FileText, MapPin, Calendar, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  district: string;
  date: string;
  status: 'pending' | 'verified' | 'resolved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  reportedBy: string;
  description: string;
}

interface ReportListProps {
  reports: Report[];
  handleReportAction: (report: Report, action: string) => void;
  getStatusColor: (status: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
}

const ReportList: React.FC<ReportListProps> = ({
  reports,
  handleReportAction,
  getStatusColor,
  getStatusBadge,
  getPriorityBadge
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>All Reports</CardTitle>
      <CardDescription>
        View all reports from citizens
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reports found
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="flex items-start justify-between p-3 border rounded-md">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-8 rounded-full ${getStatusColor(report.status)}`}></div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">
                      {report.title}
                    </h4>
                    <div className="ml-2">
                      {getPriorityBadge(report.priority)}
                    </div>
                    <div className="ml-2">
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground flex flex-col space-y-1">
                    <div className="flex items-center">
                      <FileText className="mr-1 h-3 w-3" />
                      <span>{report.id} - {report.category}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>{report.location} ({report.district})</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{new Date(report.date).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="mr-1 h-3 w-3" />
                      <span>Reported by: {report.reportedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleReportAction(report, 'view')}>
                View Details
              </Button>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

export default ReportList;
