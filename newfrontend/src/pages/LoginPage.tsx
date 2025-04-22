import React from 'react';
import Navbar from '../components/layout/Navbar';
import LoginForm from '../components/auth/LoginForm';
import { Fingerprint } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AadharLoginForm from '../components/auth/AadharLoginForm';
import AnonymousLoginButton from '../components/auth/AnonymousLoginButton';
import { Separator } from '../components/ui/separator';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8 text-center">
          <img 
            alt="Rakshak Logo"
            className="h-16 w-16 mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold mb-2">Rakshak Authentication</h1>
          <p className="text-muted-foreground">
            Sign in to access various features based on your role
          </p>
        </div>
        
        <Tabs defaultValue="email" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Login</TabsTrigger>
            <TabsTrigger value="aadhar">
              <Fingerprint className="mr-2 h-4 w-4" />
              Aadhar Login
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="aadhar">
            <AadharLoginForm />
          </TabsContent>
        </Tabs>
        
        <div className="max-w-md mx-auto mt-6">
          <Separator className="my-4" />
          <div className="text-center text-sm text-muted-foreground mb-4">
            Or continue without an account
          </div>
          <AnonymousLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
