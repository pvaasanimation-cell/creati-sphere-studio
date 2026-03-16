import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  memberProfile: MemberProfile | null;
  signUp: (email: string, password: string, meta: { name: string; username: string; country: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export interface MemberProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  country: string;
  city: string;
  bio: string;
  work: string;
  featured: boolean;
  activity_score: number;
  online: boolean;
  created_at: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) setMemberProfile(data as MemberProfile);
  };

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const setOnline = async (online: boolean) => {
    await supabase.rpc("set_online_status", { is_online: online });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAdmin(session.user.id);
            setOnline(true);
          }, 0);
        } else {
          setMemberProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdmin(session.user.id);
        setOnline(true);
      }
      setLoading(false);
    });

    // Set offline on page close
    const handleBeforeUnload = () => {
      if (user) {
        navigator.sendBeacon && setOnline(false);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const signUp = async (email: string, password: string, meta: { name: string; username: string; country: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: meta,
      },
    });

    if (!error && data.user) {
      // Create member profile
      const { error: profileError } = await supabase.from("members").insert({
        user_id: data.user.id,
        name: meta.name,
        username: meta.username,
        country: meta.country,
      });
      if (profileError) return { error: profileError };
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await setOnline(false);
    await supabase.auth.signOut();
    setMemberProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, memberProfile, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
