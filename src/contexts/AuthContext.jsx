import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

export const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const currentSession = await authService.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
      } catch (error) {
        console.error("Error al obtener la sesión inicial:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
