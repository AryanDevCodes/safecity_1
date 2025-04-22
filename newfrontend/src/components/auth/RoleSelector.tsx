import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import { Shield, User, UserCheck } from 'lucide-react';
import { UserRole } from '../../contexts/AuthContext';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  const handleRoleChange = (value: string) => {
    onRoleChange(value as UserRole);
  };

  return (
    <Tabs defaultValue={selectedRole} onValueChange={handleRoleChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="user" className="flex items-center justify-center gap-2">
          <User className="h-4 w-4" />
          <span>Citizen</span>
        </TabsTrigger>
        <TabsTrigger value="officer" className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Officer</span>
        </TabsTrigger>
        <TabsTrigger value="admin" className="flex items-center justify-center gap-2">
          <UserCheck className="h-4 w-4" />
          <span>Admin</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="user">
        <div className="p-4 bg-blue-50 rounded-md mb-4 text-sm">
          Login as a citizen to report incidents and view crime data.
        </div>
      </TabsContent>
      <TabsContent value="officer">
        <div className="p-4 bg-blue-50 rounded-md mb-4 text-sm">
          Login as a police officer to manage incidents and respond to reports.
        </div>
      </TabsContent>
      <TabsContent value="admin">
        <div className="p-4 bg-blue-50 rounded-md mb-4 text-sm">
          Login as an administrator to manage the system and access all features.
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RoleSelector;
