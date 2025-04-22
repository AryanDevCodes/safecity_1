import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { FileText, Search, Filter, Download, Printer, MapPin, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import ReportFilters from './ReportFilters';
import ReportList from './ReportList';
import ReportDetailDialog from './ReportDetailDialog';

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'verified': return 'bg-blue-500';
    case 'resolved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'verified':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Verified</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
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

const ReportsPage = () => {
  const { toast } = useToast();
  const { role } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports?page=${page}`);
        const result = await response.json();
        setTotalPages(result.totalPages || 1);
        const data = Array.isArray(result.content)
          ? result.content.map(item => ({
              id: item.id,
              title: item.reportType || 'General', // or item.title if available
              category: item.reportType || 'General',
              location: item.location,
              district: item.location?.split(',')[2]?.trim() || '',
              date: item.createdAt,
              status: (item.status || '').toLowerCase(),
              priority: 'medium',
              reportedBy: item.reportedBy,
              description: item.description
            }))
          : [];
        setReports(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [page]);

  const handleReportAction = (report: Report, action: string) => {
    setSelectedReport(report);
    
    if (action === "view") {
      setShowDetails(true);
    } else if (action === "verify") {
      toast({
        title: "Report Verified",
        description: `Report ${report.id} has been verified successfully`,
        variant: "default",
      });
    } else if (action === "resolve") {
      toast({
        title: "Report Resolved",
        description: `Report ${report.id} has been marked as resolved`,
        variant: "default",
      });
    } else if (action === "reject") {
      toast({
        title: "Report Rejected",
        description: `Report ${report.id} has been rejected`,
        variant: "default",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Report Export",
      description: "All reports have been exported to Excel format",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing",
      description: "Reports are being sent to printer",
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setCategoryFilter(null);
    setDistrictFilter(null);
  };

  const pageTitle = role === 'admin' 
    ? "Report Management (Admin)"
    : "Report Management";

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === "" || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
        
    const matchesStatus = statusFilter === null || report.status === statusFilter;
    const matchesCategory = categoryFilter === null || report.category === categoryFilter;
    const matchesDistrict = districtFilter === null || report.district === districtFilter;
      
    return matchesSearch && matchesStatus && matchesCategory && matchesDistrict;
  });

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-orange-700 mr-2" />
            <h1 className="text-2xl font-bold text-amber-900">{pageTitle}</h1>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-amber-200 shadow-sm">
            <div className="mb-4">
              <p className="text-amber-800">
                Manage all incident reports submitted by citizens. You can filter, sort, and take action on reports based on their status.
              </p>
            </div>
            
            <ReportFilters 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              statusFilter={statusFilter} 
              setStatusFilter={setStatusFilter} 
              categoryFilter={categoryFilter} 
              setCategoryFilter={setCategoryFilter} 
              districtFilter={districtFilter} 
              setDistrictFilter={setDistrictFilter} 
              resetFilters={resetFilters} 
              handleExport={handleExport} 
              handlePrint={handlePrint} 
            />
            
            <ReportList 
              reports={filteredReports} 
              handleReportAction={handleReportAction} 
              getStatusColor={getStatusColor} 
              getStatusBadge={getStatusBadge} 
              getPriorityBadge={getPriorityBadge} 
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={handlePrevPage}>
                Previous
              </Button>
              <span className="flex items-center px-2">Page {page + 1} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={handleNextPage}>
                Next
              </Button>
            </div>
          </div>
        </div>

        {showDetails && selectedReport && (
          <ReportDetailDialog 
            report={selectedReport} 
            setShowDetails={setShowDetails} 
            handleReportAction={handleReportAction} 
            getStatusBadge={getStatusBadge} 
            getPriorityBadge={getPriorityBadge} 
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
