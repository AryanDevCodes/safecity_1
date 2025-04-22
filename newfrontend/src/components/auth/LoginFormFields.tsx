import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Loader2 } from 'lucide-react';
import { UserRole } from '../../contexts/AuthContext';

// Form schema for validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Type for form values
export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormFieldsProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoggingIn: boolean;
  selectedRole: UserRole;
  setFormRef?: (form: unknown) => void;
}

const LoginFormFields = ({ onSubmit, isLoggingIn, selectedRole , setFormRef }: LoginFormFieldsProps) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (setFormRef) {
      setFormRef(form);
    }
  }, [form, setFormRef]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          style={{
            opacity: 1,
            background: "#007bff",
            color: "#fff",
            pointerEvents: "auto",
            fontWeight: "bold",
            border: "2px solid #007bff"
          }}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginFormFields;
