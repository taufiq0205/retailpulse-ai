import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  role: string;
  user_metadata?: {
    store_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  storeName: string;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("Mas Jaya Retail, KL"); // Default MVP single store context

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user as User);
          if (data.session.user?.user_metadata?.store_name) {
            setStoreName(data.session.user.user_metadata.store_name);
          }
        }
      } catch (err) {
        console.error("Error checking auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ? (session.user as User) : null);
      if (session?.user?.user_metadata?.store_name) {
        setStoreName(session.user.user_metadata.store_name);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, storeName, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
