import React from 'react';
import { Search, Filter, Download, Printer } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string | null;
  setStatusFilter: (v: string | null) => void;
  districtFilter: string | null;
  setDistrictFilter: (v: string | null) => void;
  resetFilters: () => void;
  handleExport: () => void;
  handlePrint: () => void;
  reloadReports: () => void;
  loading: boolean;
}

const districts = ['Bhopal', 'Gurugram', 'Delhi', 'Mumbai']; // Use dynamic if available

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  districtFilter,
  setDistrictFilter,
  resetFilters,
  handleExport,
  handlePrint,
  reloadReports,
  loading
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
    <div className="relative flex-1 w-full sm:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by ID, type, location or complainant..."
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <Select value={statusFilter || ''} onValueChange={(val) => setStatusFilter(val === '' ? null : val)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
      <Select value={districtFilter || ''} onValueChange={(val) => setDistrictFilter(val === '' ? null : val)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="District" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Districts</SelectItem>
          {districts.map(district => (
            <SelectItem key={district} value={district}>{district}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={resetFilters}>
        <Filter className="h-4 w-4 mr-1" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={reloadReports} disabled={loading}>
        Reload
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-1" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-1" />
        Print
      </Button>
    </div>
  </div>
);

export default DashboardFilters;
