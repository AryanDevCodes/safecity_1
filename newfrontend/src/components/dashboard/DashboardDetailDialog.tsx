import React from 'react';
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

interface DashboardDetailDialogProps {
  report: Report;
  setShowDetails: (show: boolean) => void;
  handleReportAction: (report: Report, action: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
}

const DashboardDetailDialog: React.FC<DashboardDetailDialogProps> = ({
  report,
  setShowDetails,
  handleReportAction,
  getStatusBadge,
  getPriorityBadge
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-900">{report.type}</h2>
            <p className="text-muted-foreground">Case: {report.id}</p>
          </div>
          <div className="flex items-center">
            {getPriorityBadge(report.priority)}
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => setShowDetails(false)}>
              ✕
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Complainant</h3>
            <p className="font-medium">{report.complainant}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
            <p>{report.contactNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
            <p>{report.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">District</h3>
            <p>{report.district}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Date and Time</h3>
            <p>{new Date(report.date).toLocaleString('en-US')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
            <p>{getStatusBadge(report.status)}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Details</h3>
          <div className="p-3 bg-amber-50 rounded-md">
            <p>{report.details || 'No details available.'}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Officer Notes</h3>
          <textarea 
            className="w-full p-3 border rounded-md"
            rows={3}
            placeholder="Add your notes about the case..."
          ></textarea>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          {report.status === 'new' && (
            <Button className="bg-orange-700 hover:bg-orange-800" onClick={() => {
              handleReportAction(report, 'assign');
              setShowDetails(false);
            }}>
              Assign to Self
            </Button>
          )}
          {report.status === 'in-progress' && (
            <Button className="bg-green-700 hover:bg-green-800" onClick={() => {
              handleReportAction(report, 'resolve');
              setShowDetails(false);
            }}>
              Mark as Resolved
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardDetailDialog;
