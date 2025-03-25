'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/login-form';
import { toast } from "sonner"

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(formData.email, formData.password);
      // Use Next.js router for client-side navigation
      router.push('/dashboard');
      toast.success('Logged in successfully');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {error && (
        <div className="absolute top-4 w-full max-w-md mx-auto bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
}