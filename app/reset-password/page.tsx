"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { createSupabaseClient } from '@/lib/supabase.client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenPresent, setTokenPresent] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    // If Supabase adds a session via the reset link, the user will be signed in.
    // We just need to show the form. If not, the SDK usually handles the redirect.
    setTokenPresent(typeof window !== 'undefined' && window.location.search.includes('access_token'));
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If the SDK created a session from the URL the user is signed in and we can call updateUser.
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully. Please sign in.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {!tokenPresent && (
          <p className="mb-4 text-sm text-gray-600">If you followed a password reset link, you should be able to set a new password here.</p>
        )}
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
