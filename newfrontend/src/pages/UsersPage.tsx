import React from 'react';
import Navbar from '../components/layout/Navbar';
import UserManagement from '../components/admin/UserManagement';
import { Shield } from 'lucide-react';

const UsersPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-police-700 mr-2" />
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
