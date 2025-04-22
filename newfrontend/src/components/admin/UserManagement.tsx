import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Search, MoreHorizontal, Shield, User, UserCheck, Plus, UserX, Edit } from 'lucide-react';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Mock user data for demonstration
const mockUsers = [
  {
    id: 'user-1',
    name: 'John Citizen',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    joinedDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'officer-1',
    name: 'Officer Smith',
    email: 'officer@police.gov',
    role: 'officer',
    status: 'active',
    joinedDate: '2022-11-05',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'admin-1',
    name: 'Admin Johnson',
    email: 'admin@safecity.org',
    role: 'admin',
    status: 'active',
    joinedDate: '2022-10-01',
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
    status: 'inactive',
    joinedDate: '2023-03-22',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  
  // Filter users based on search and role filter
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = filterRole ? user.role === filterRole : true;
    
    return matchesSearch && matchesRole;
  });
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
      case 'officer':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Officer</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Citizen</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      : <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>;
  };
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin':
        return <UserCheck className="h-4 w-4 text-purple-600" />;
      case 'officer':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={filterRole === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole(null)}
          >
            All
          </Button>
          <Button 
            variant={filterRole === 'user' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole('user')}
          >
            <User className="h-4 w-4 mr-1" />
            Citizens
          </Button>
          <Button 
            variant={filterRole === 'officer' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole('officer')}
          >
            <Shield className="h-4 w-4 mr-1" />
            Officers
          </Button>
          <Button 
            variant={filterRole === 'admin' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole('admin')}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Admins
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
          <Button size="sm" className="bg-police-700 hover:bg-police-800">
            <Plus className="h-4 w-4 mr-1" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <UserX className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
