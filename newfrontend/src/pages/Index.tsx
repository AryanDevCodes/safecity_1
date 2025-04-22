import React from 'react';
import AnonymousDashboard from '../components/dashboard/AnonymousDashboard';
import Navbar from '../components/layout/Navbar';

const Index = () => (
  <div className="min-h-screen bg-amber-50">
    <Navbar />
    <div className="container mx-auto px-4 py-8 mt-16">
      <AnonymousDashboard />
    </div>
  </div>
);

export default Index;