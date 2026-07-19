import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = !!(supabaseUrl && supabaseKey);

// Custom Mock Client for local preview and testing when Supabase keys are not set
const createMockSupabase = () => {
  const getStoredUser = () => {
    const sessionStr = localStorage.getItem("retailpulse_mock_session");
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  };

  const setStoredUser = (email: string | null) => {
    if (!email) {
      localStorage.removeItem("retailpulse_mock_session");
    } else {
      localStorage.setItem(
        "retailpulse_mock_session",
        JSON.stringify({
          id: "mock-user-uuid-123456",
          email,
          role: "store_manager",
          user_metadata: { store_name: "Mas Jaya Retail, KL" },
        })
      );
    }
  };

  const listeners = new Set<(event: string, session: any) => void>();

  return {
    auth: {
      async getSession() {
        const user = getStoredUser();
        if (user) {
          return {
            data: {
              session: {
                user,
                access_token: "mock-jwt-token-abcd",
                expires_at: Math.floor(Date.now() / 1000) + 3600,
              },
            },
            error: null,
          };
        }
        return { data: { session: null }, error: null };
      },

      async signInWithPassword({ email, password }: any) {
        if (!email || !password) {
          return { data: { user: null, session: null }, error: { message: "Email and password are required" } };
        }
        if (password.length < 6) {
          return { data: { user: null, session: null }, error: { message: "Password must be at least 6 characters" } };
        }
        setStoredUser(email);
        const user = getStoredUser();
        const session = {
          user,
          access_token: "mock-jwt-token-abcd",
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user, session }, error: null };
      },

      async signUp({ email, password }: any) {
        if (!email || !password) {
          return { data: { user: null, session: null }, error: { message: "Email and password are required" } };
        }
        if (password.length < 6) {
          return { data: { user: null, session: null }, error: { message: "Password must be at least 6 characters" } };
        }
        setStoredUser(email);
        const user = getStoredUser();
        const session = {
          user,
          access_token: "mock-jwt-token-abcd",
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user, session }, error: null };
      },

      async signOut() {
        setStoredUser(null);
        listeners.forEach((cb) => cb("SIGNED_OUT", null));
        return { error: null };
      },

      onAuthStateChange(callback: (event: string, session: any) => void) {
        listeners.add(callback);
        // Fire initial callback
        const user = getStoredUser();
        const session = user
          ? {
              user,
              access_token: "mock-jwt-token-abcd",
              expires_at: Math.floor(Date.now() / 1000) + 3600,
            }
          : null;
        callback(user ? "SIGNED_IN" : "INITIAL_SESSION", session);

        return {
          data: {
            subscription: {
              unsubscribe() {
                listeners.delete(callback);
              },
            },
          },
        };
      },
    },
  };
};

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : (createMockSupabase() as any);

export const isSupabaseMocked = !isConfigured;
