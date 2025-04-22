import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AnonymousLoginButton = () => {
  const { loginAnonymously } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await loginAnonymously();
      toast({
        title: "Anonymous Access Granted",
        description: "You are now browsing as a guest user with limited access.",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      console.error('Anonymous login failed:', error);
      toast({
        title: "Access Failed",
        description: "Could not login anonymously. Please try again or use email login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAnonymousLogin} 
      variant="outline" 
      className="w-full" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Accessing...
        </>
      ) : (
        <>
          <EyeOff className="mr-2 h-4 w-4" />
          Continue Anonymously
        </>
      )}
    </Button>
  );
};

export default AnonymousLoginButton;
