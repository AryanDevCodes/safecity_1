import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LocationTracking from '../officer/LocationTracking';
import { useAuth } from '@/contexts/AuthContext';

const OfficerLayout: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {user?.role === 'officer' && <LocationTracking />}
            <div className="container mx-auto px-4 py-8">
                <Outlet />
            </div>
        </div>
    );
};

export default OfficerLayout;