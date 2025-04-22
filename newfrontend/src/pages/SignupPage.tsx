import React from 'react';
import Navbar from '../components/layout/Navbar';
import SignupForm from '../components/auth/SignupForm';
import { UserPlus } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8 text-center">
          <UserPlus className="h-12 w-12 mx-auto text-police-700 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Create SafeCity Account</h1>
          <p className="text-muted-foreground">
            Join our community and help build a safer city for everyone
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
