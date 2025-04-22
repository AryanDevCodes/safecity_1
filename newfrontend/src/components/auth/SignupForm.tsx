import { useNavigate, Link } from 'react-router-dom';
import { UserRole, useAuth } from '@/contexts/AuthContext.tsx';
import { useToast } from '@/hooks/use-toast.ts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import RoleSelector from './RoleSelector';
import SignupFormFields, { SignupFormValues } from './SignupFormFields';
import {useState} from "react";

const SignupForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [isRegistering, setIsRegistering] = useState(false);

  // Handle role tab change
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  // Handle form submission
  const onSubmit = async (values: SignupFormValues) => {
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsRegistering(true);
      
      // Use the registration function from auth context
      await register(values.name, values.email, values.password, selectedRole.toUpperCase() as UserRole);
      
      // Role-specific welcome messages
      let welcomeMessage = "Welcome to SafeCity!";
      if (selectedRole === 'admin') {
        welcomeMessage = "Welcome to SafeCity Admin Portal!";
      } else if (selectedRole === 'officer') {
        welcomeMessage = "Welcome to SafeCity Officer Portal!";
      }
      
      toast({
        title: "Registration successful",
        description: welcomeMessage,
        variant: "default",
      });
      
      // Redirect based on role
      if (selectedRole === 'admin') {
        navigate('/dashboard');
      } else if (selectedRole === 'officer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Role-specific titles and descriptions
  const getRoleSpecificContent = () => {
    switch (selectedRole) {
      case 'admin':
        return {
          title: "Create Admin Account",
          description: "Register as an administrator to manage SafeCity platform"
        };
      case 'officer':
        return {
          title: "Create Officer Account",
          description: "Register as a police officer to respond to incidents"
        };
      default:
        return {
          title: "Create Citizen Account",
          description: "Register to report incidents and stay informed"
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{roleContent.title}</CardTitle>
        <CardDescription className="text-center">
          {roleContent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleSelector 
          selectedRole={selectedRole} 
          onRoleChange={handleRoleChange} 
        />

        <SignupFormFields 
          onSubmit={onSubmit} 
          isRegistering={isRegistering} 
          selectedRole={selectedRole}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-police-700 hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
