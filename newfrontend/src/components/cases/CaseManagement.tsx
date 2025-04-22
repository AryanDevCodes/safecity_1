import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  AlertTriangle,
  BadgeAlert,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Filter,
  MapPin,
  Search,
  Shield,
  UserCheck,
  Users,
  Calendar,
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

// Define case types
interface Case {
  id: string;
  title: string;
  type: string;
  status: 'open' | 'assigned' | 'in-progress' | 'closed' | 'archived';
  priority: 'high' | 'medium' | 'low';
  location: string;
  description: string;
  reportedAt: string;
  assignedTo: string | null;
  lastUpdated: string;
  caseNotes: CaseNote[];
}

interface CaseNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

// Mock data with Indian locations
const mockCases: Case[] = [
  {
    id: 'C-2023-001',
    title: 'Shoplifting at Delhi Main Market',
    type: 'Theft',
    status: 'open',
    priority: 'medium',
    location: 'Delhi Main Market, Connaught Place',
    description: 'Store owner reported shoplifting incident. CCTV footage available for review.',
    reportedAt: '2023-04-10T14:30:00Z',
    assignedTo: null,
    lastUpdated: '2023-04-10T14:30:00Z',
    caseNotes: []
  },
  {
    id: 'C-2023-002',
    title: 'Vandalism at Lodi Gardens',
    type: 'Vandalism',
    status: 'assigned',
    priority: 'low',
    location: 'Lodi Gardens, New Delhi',
    description: 'Graffiti on park structures and historical monuments. Park security has photos.',
    reportedAt: '2023-04-11T09:15:00Z',
    assignedTo: 'Officer Singh',
    lastUpdated: '2023-04-11T10:20:00Z',
    caseNotes: [
      {
        id: 'CN-001',
        content: 'Received photos from park security. Will visit site tomorrow morning.',
        author: 'Officer Singh',
        timestamp: '2023-04-11T10:20:00Z'
      }
    ]
  },
  {
    id: 'C-2023-003',
    title: 'Assault at Mumbai Club',
    type: 'Assault',
    status: 'in-progress',
    priority: 'high',
    location: 'Starlight Club, Bandra, Mumbai',
    description: 'Physical altercation between two individuals. One victim transported to Lilavati Hospital.',
    reportedAt: '2023-04-09T23:45:00Z',
    assignedTo: 'Officer Sharma',
    lastUpdated: '2023-04-10T08:30:00Z',
    caseNotes: [
      {
        id: 'CN-002',
        content: 'Victim statement collected. Working on locating witnesses.',
        author: 'Officer Sharma',
        timestamp: '2023-04-10T08:30:00Z'
      },
      {
        id: 'CN-003',
        content: 'Club staff provided security footage. Two witnesses identified.',
        author: 'Officer Sharma',
        timestamp: '2023-04-10T15:45:00Z'
      }
    ]
  },
  {
    id: 'C-2023-004',
    title: 'Suspicious Activity in Residential Area',
    type: 'Suspicious Activity',
    status: 'open',
    priority: 'medium',
    location: 'Vasant Kunj Apartments, Block C, New Delhi',
    description: 'Resident reported unknown individuals trying door handles in the hallway.',
    reportedAt: '2023-04-11T02:20:00Z',
    assignedTo: null,
    lastUpdated: '2023-04-11T02:20:00Z',
    caseNotes: []
  },
  {
    id: 'C-2023-005',
    title: 'Vehicle Break-in',
    type: 'Theft',
    status: 'closed',
    priority: 'low',
    location: 'Select Citywalk Mall Parking, Saket, Delhi',
    description: 'Vehicle window broken, personal items stolen from car.',
    reportedAt: '2023-04-08T17:30:00Z',
    assignedTo: 'Officer Patel',
    lastUpdated: '2023-04-10T16:15:00Z',
    caseNotes: [
      {
        id: 'CN-004',
        content: 'Collected evidence and took photos of the scene.',
        author: 'Officer Patel',
        timestamp: '2023-04-08T18:45:00Z'
      },
      {
        id: 'CN-005',
        content: 'No usable fingerprints found. Mall camera footage was reviewed but inconclusive.',
        author: 'Officer Patel',
        timestamp: '2023-04-09T11:30:00Z'
      },
      {
        id: 'CN-006',
        content: 'Case closed due to lack of leads. Owner informed and report filed for insurance.',
        author: 'Officer Patel',
        timestamp: '2023-04-10T16:15:00Z'
      }
    ]
  }
];

// Component for handling case details
const CaseDetails = ({ caseData, onStatusChange }: { caseData: Case, onStatusChange: (id: string, newStatus: Case['status']) => void }) => {
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!note.trim()) {
      toast({
        title: "Cannot add empty note",
        description: "Please enter some content for your case note",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Note added",
      description: "Your case note has been added successfully"
    });

    setNote('');
  };

  const statusBadgeColor = (status: Case['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'assigned': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'in-progress': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'archived': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const priorityBadgeColor = (priority: Case['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{caseData.title}</h2>
          <div className="text-sm text-muted-foreground">Case ID: {caseData.id}</div>
        </div>
        <div className="flex gap-2">
          <Badge className={statusBadgeColor(caseData.status)}>
            {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
          </Badge>
          <Badge className={priorityBadgeColor(caseData.priority)}>
            {caseData.priority.charAt(0).toUpperCase() + caseData.priority.slice(1)} Priority
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">Case Type</div>
                <div>{caseData.type}</div>
              </div>
              <div>
                <div className="font-medium">Location</div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                  <span>{caseData.location}</span>
                </div>
              </div>
              <div>
                <div className="font-medium">Reported</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(caseData.reportedAt).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(caseData.lastUpdated).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="font-medium">Assigned To</div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-1" />
                  <span>{caseData.assignedTo || "Unassigned"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{caseData.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Notes</CardTitle>
          <CardDescription>
            {caseData.caseNotes.length === 0 ? 
              "No notes have been added to this case yet." : 
              `${caseData.caseNotes.length} notes on this case`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caseData.caseNotes.map((note) => (
              <div key={note.id} className="border rounded-md p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{note.author}</span>
                  <span className="text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <p>{note.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="font-medium">Add Note</div>
            <div className="flex flex-col space-y-2">
              <textarea 
                className="border rounded-md p-2 min-h-[100px] resize-none" 
                placeholder="Enter case note details..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button onClick={handleAddNote}>Add Note</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Select 
              defaultValue={caseData.status}
              onValueChange={(value) => onStatusChange(caseData.id, value as Case['status'])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button>Update Case</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const CaseManagement = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all'
  });
  const { toast } = useToast();

  const caseTypes = Array.from(new Set(mockCases.map(c => c.type)));
  
  // Filter cases based on search and filters
  const filteredCases = mockCases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || c.status === filters.status;
    const matchesPriority = filters.priority === 'all' || c.priority === filters.priority;
    const matchesType = filters.type === 'all' || c.type === filters.type;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });
  
  const getStatusCount = (status: Case['status']) => {
    return mockCases.filter(c => c.status === status).length;
  };
  
  const handleStatusChange = (id: string, newStatus: Case['status']) => {
    // In a real app, this would update the case status in the backend
    toast({
      title: "Status Updated",
      description: `Case ${id} status changed to ${newStatus}`
    });
    
    // Update the selected case if it's the current one
    if (selectedCase && selectedCase.id === id) {
      setSelectedCase({
        ...selectedCase,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
    }
  };
  
  const handleAssignToMe = (caseId: string) => {
    toast({
      title: "Case Assigned",
      description: `Case ${caseId} has been assigned to you`
    });
    
    // In a real app, this would update the case in the backend
  };
  
  return (
    <div className="space-y-6">
      {selectedCase ? (
        <div>
          <Button variant="ghost" className="mb-4" onClick={() => setSelectedCase(null)}>
            <ChevronDown className="h-4 w-4 mr-1" />
            Back to Cases
          </Button>
          <CaseDetails caseData={selectedCase} onStatusChange={handleStatusChange} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search cases by ID, title or location..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value as string})}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.priority} 
                onValueChange={(value) => setFilters({...filters, priority: value as string})}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters({...filters, type: value as string})}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Case Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {caseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="icon" onClick={() => setFilters({status: 'all', priority: 'all', type: 'all'})}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center">
                <BadgeAlert className="mr-1 h-4 w-4" />
                <span>All Cases</span>
                <Badge className="ml-2 bg-police-100 text-police-700 hover:bg-police-100">
                  {mockCases.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="flex items-center">
                <AlertTriangle className="mr-1 h-4 w-4" />
                <span>Open</span>
                <Badge className="ml-2 bg-police-100 text-police-700 hover:bg-police-100">
                  {getStatusCount('open')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="assigned" className="flex items-center">
                <UserCheck className="mr-1 h-4 w-4" />
                <span>Assigned</span>
                <Badge className="ml-2 bg-police-100 text-police-700 hover:bg-police-100">
                  {getStatusCount('assigned')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>In Progress</span>
                <Badge className="ml-2 bg-police-100 text-police-700 hover:bg-police-100">
                  {getStatusCount('in-progress')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" />
                <span>Closed</span>
                <Badge className="ml-2 bg-police-100 text-police-700 hover:bg-police-100">
                  {getStatusCount('closed')}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            {['all', 'open', 'assigned', 'in-progress', 'closed'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="grid gap-4">
                  {filteredCases
                    .filter(c => tab === 'all' ? true : c.status === tab)
                    .map(caseItem => (
                      <Card key={caseItem.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{caseItem.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                <span>{caseItem.id}</span>
                                <span className="mx-2">•</span>
                                <span>{caseItem.type}</span>
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={
                                caseItem.priority === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                caseItem.priority === 'medium' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' :
                                'bg-green-100 text-green-800 hover:bg-green-100'
                              }>
                                {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                              </Badge>
                              <Badge className={
                                caseItem.status === 'open' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                caseItem.status === 'assigned' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' :
                                caseItem.status === 'in-progress' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' :
                                caseItem.status === 'closed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                'bg-gray-100 text-gray-800 hover:bg-gray-100'
                              }>
                                {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1).replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{caseItem.location}</span>
                          </div>
                          <p className="line-clamp-2 text-sm">{caseItem.description}</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t p-3 bg-muted/20">
                          <div className="flex items-center text-sm">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>
                              Reported: {new Date(caseItem.reportedAt).toLocaleDateString()}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {caseItem.caseNotes.length} notes
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {!caseItem.assignedTo && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => handleAssignToMe(caseItem.id)}
                              >
                                <Users className="h-3.5 w-3.5 mr-1" />
                                Assign to Me
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              className="h-8 bg-police-700 hover:bg-police-800"
                              onClick={() => setSelectedCase(caseItem)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
                {filteredCases.filter(c => tab === 'all' ? true : c.status === tab).length === 0 && (
                  <div className="text-center py-10">
                    <Shield className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No cases found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tab === 'all' ? 
                        "There are no cases that match your search criteria." :
                        `There are no ${tab} cases that match your search criteria.`}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CaseManagement;
