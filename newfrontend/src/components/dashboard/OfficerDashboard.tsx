import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardStats from './DashboardStats';
import DashboardReportList from './DashboardReportList';
import DashboardFilters from './DashboardFilters';
import DashboardDetailDialog from './DashboardDetailDialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '@/components/ui/badge.tsx';
import { toast } from '@/hooks/use-toast.ts';
import { AlertTriangle, Bell, Calendar, CheckCircle, Clock, FileText, MapPin, MoreHorizontal, ShieldAlert, User, Users, Filter, Search, Download, Printer } from 'lucide-react';

interface Report {
  id: string;
  type: string;
  location: string;
  date: string;
  status: 'new' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  district: string;
  complainant: string;
  contactNumber?: string;
  details?: string;
}

const OfficerDashboard = () => {
  const { user, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/reports?page=${page}`);
        const result = await response.json();
        setTotalPages(result.totalPages || 1);
        const data = Array.isArray(result.content) ? result.content.map(item => ({
          id: item.id,
          type: item.reportType || 'General',
          location: item.location,
          date: item.createdAt,
          status: (item.status || '').toLowerCase() === 'new' ? 'new' : (item.status || '').toLowerCase(),
          priority: 'medium', // Default or map if you have a field
          district: item.location?.split(',')[2]?.trim() || '',
          complainant: item.reportedBy,
          contactNumber: '',
          details: item.description
        })) : [];
        setReports(data);
      } catch (error) {
        setError(error.message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [page]);

  const reloadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reports');
      const result = await response.json();
      const data = Array.isArray(result.content) ? result.content.map(item => ({
        id: item.id,
        type: item.reportType || 'General',
        location: item.location,
        date: item.createdAt,
        status: (item.status || '').toLowerCase() === 'new' ? 'new' : (item.status || '').toLowerCase(),
        priority: 'medium',
        district: item.location?.split(',')[2]?.trim() || '',
        complainant: item.reportedBy,
        contactNumber: '',
        details: item.description
      })) : [];
      setReports(data);
    } catch (error) {
      setError(error.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique districts from reports
  const districts = Array.from(new Set(reports.map(report => report.district)));

  // Filter reports based on search, priority and district
  const filterReports = (reports: Report[]) => {
    return reports.filter(report => {
      const matchesSearch = searchQuery === "" || 
        report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.complainant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesPriority = priorityFilter === null || report.priority === priorityFilter;
      const matchesDistrict = districtFilter === null || report.district === districtFilter;
      
      return matchesSearch && matchesPriority && matchesDistrict;
    });
  };

  const handleReportAction = (report: Report, action: string) => {
    setSelectedReport(report);
    
    if (action === "review" || action === "details") {
      setShowDetails(true);
    } else if (action === "update") {
      // For update action, show details and allow editing
      setShowDetails(true);
    } else if (action === "assign") {
      toast({
        title: "Case Assigned",
        description: `Case ${report.id} assigned to you`,
        variant: "default",
      });
    } else if (action === "resolve") {
      toast({
        title: "Case Resolved",
        description: `Case ${report.id} resolved successfully`,
        variant: "default",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Reports",
      description: "All reports exported in Excel format",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing Reports",
      description: "Reports sent to print",
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriorityFilter(null);
    setDistrictFilter(null);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  // Calculate statistics
  const newReportsCount = reports.filter(r => r.status === 'new').length;
  const inProgressCount = reports.filter(r => r.status === 'in-progress').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const highPriorityCount = reports.filter(r => r.priority === 'high').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in-progress': return 'bg-amber-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'New';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <Button onClick={reloadReports}>Reload Reports</Button>
      </div>
    );
  }

  if (reports.length === 0 && role === 'officer') {
    return (
      <div>
        <p>No reports loaded. Please click the button to load reports.</p>
        <Button onClick={reloadReports}>Load Reports</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-amber-900">
            {role === 'admin' ? 'Admin Dashboard' : 'Officer Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            Welcome, {user?.name || 'Officer'}. You have {newReportsCount} new reports to review.
          </p>
        </div>
        <div className="flex items-center">
          <div className="hidden md:block mr-4 text-right">
            <p className="text-sm font-medium">{user?.name || 'Officer'}</p>
            <p className="text-xs text-muted-foreground">Badge #{user?.id?.split('-')[1] || '34891'}</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-orange-200">
            <AvatarFallback className="bg-orange-100 text-orange-700">{user?.name?.split(' ').map(n => n[0]).join('') || 'OP'}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Statistics Cards */}
      <DashboardStats newCount={newReportsCount} inProgressCount={inProgressCount} resolvedCount={resolvedCount} />

      {/* Filters */}
      <DashboardFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={priorityFilter}
        setStatusFilter={setPriorityFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        resetFilters={resetFilters}
        handleExport={handleExport}
        handlePrint={handlePrint}
        reloadReports={reloadReports}
        loading={loading}
      />

      {/* Report List */}
      <DashboardReportList
        reports={filterReports(reports)}
        handleReportAction={handleReportAction}
        getStatusBadge={getStatusText}
        getPriorityBadge={getPriorityBadge}
      />

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" disabled={page === 0} onClick={handlePrevPage}>
          Previous
        </Button>
        <span className="flex items-center px-2">Page {page + 1} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={handleNextPage}>
          Next
        </Button>
      </div>

      {/* Detail Dialog */}
      {showDetails && selectedReport && (
        <DashboardDetailDialog
          report={selectedReport}
          setShowDetails={setShowDetails}
          handleReportAction={handleReportAction}
          getStatusBadge={getStatusText}
          getPriorityBadge={getPriorityBadge}
        />
      )}
    </div>
  );
};

export default OfficerDashboard;
