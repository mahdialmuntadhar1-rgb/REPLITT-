import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { setAuth, setInitialized } = useAuthStore();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id).then(profile => {
          setAuth(session.user, profile);
        });
      }
      setInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const profile = await fetchProfile(session.user.id);
        setAuth(session.user, profile);
      } else {
        setAuth(null, null);
      }
      setInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: newUserProfile } = await supabase.auth.getUser();
      if (newUserProfile.user) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: newUserProfile.user.user_metadata.full_name || '',
            email: newUserProfile.user.email,
            role: 'user'
          })
          .select()
          .single();
        return newProfile;
      }
    }
    return data;
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { signInWithGoogle, signOut };
}
