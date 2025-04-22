import React from 'react';
import { Search, Filter, Download, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface ReportFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string | null;
  setStatusFilter: (v: string | null) => void;
  categoryFilter: string | null;
  setCategoryFilter: (v: string | null) => void;
  districtFilter: string | null;
  setDistrictFilter: (v: string | null) => void;
  resetFilters: () => void;
  handleExport: () => void;
  handlePrint: () => void;
}

const categories = ['Theft', 'Vandalism', 'Assault', 'Suspicious Activity', 'Noise Complaint', 'Cybercrime'];
const districts = ['Central Delhi', 'South Delhi', 'West Delhi', 'East Delhi', 'Gurugram'];

const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  districtFilter,
  setDistrictFilter,
  resetFilters,
  handleExport,
  handlePrint
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="relative flex-1 w-full sm:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by ID, title, location or reporter..."
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
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter || ''} onValueChange={(val) => setCategoryFilter(val === '' ? null : val)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
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
      <div className="flex items-center gap-2 ml-auto">
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
  </div>
);

export default ReportFilters;
