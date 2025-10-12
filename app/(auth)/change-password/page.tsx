"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { createSupabaseClient } from '@/lib/supabase.client';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseClient();

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);

    try {
      // Try to update password directly (preferred)
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (!updateError) {
        toast.success('Password updated successfully');
        setLoading(false);
        return;
      }

      // If direct update failed, attempt to reauthenticate using old password then retry
      console.warn('updateUser error, attempting reauth:', updateError.message);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const email = session?.user?.email;
      if (!email) {
        toast.error('You must be signed in to change your password');
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: oldPassword });
      if (signInError) {
        toast.error('Old password is incorrect');
        setLoading(false);
        return;
      }

      // Retry update after reauth
      const { error: retryError } = await supabase.auth.updateUser({ password: newPassword });
      if (retryError) {
        toast.error(retryError.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully');
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
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleChange} className="space-y-4">
          <Input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
