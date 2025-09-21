// 'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { createSupabaseClient } from '@/lib/supabase.client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createSupabaseClient()).current;
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    getInitialSession();

    subscriptionRef.current = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    ).data.subscription;

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile]);
  const isCustomer = useMemo(() => profile?.role === 'customer', [profile]);

  return useMemo(() => ({
    user,
    profile,
    loading,
    signOut,
    isAdmin,
    isCustomer,
  }), [user, profile, loading, isAdmin, isCustomer]);
}