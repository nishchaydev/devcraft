import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, SEEDED_VENDORS, seedVendorProfiles } from '../lib/supabase';
import { Profile, UserRole } from '../types/app';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  activeProfile: Profile | null;
  viewRole: UserRole;
  loading: boolean;
  vendorList: Profile[];
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  loginAsVendor: (vendor: Profile) => void;
  loginAsCustomer: (customer: Profile) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchViewMode: (role: UserRole, vendorId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [viewRole, setViewRole] = useState<UserRole>('customer');
  const [vendorList, setVendorList] = useState<Profile[]>(SEEDED_VENDORS);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
        setActiveProfile(data);
        setViewRole(data.role || 'customer');
      } else {
        setProfile(null);
        setActiveProfile(null);
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
      setProfile(null);
      setActiveProfile(null);
    }
  };

  useEffect(() => {
    // Auto-seed vendor profiles in Supabase on startup
    seedVendorProfiles().then((vendors) => {
      setVendorList(vendors);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (data.session?.user) {
      setViewRole('customer');
      await fetchProfile(data.session.user.id);
    }
    return { error };
  };

  const loginAsVendor = (vendor: Profile) => {
    setViewRole('owner');
    setActiveProfile(vendor);
    setProfile(vendor);
    const syntheticSession: any = {
      access_token: 'demo-vendor-session',
      user: { id: vendor.id, email: vendor.email },
    };
    setSession(syntheticSession);
    setUser(syntheticSession.user);
  };

  const loginAsCustomer = (customer: Profile) => {
    setViewRole('customer');
    setActiveProfile(customer);
    setProfile(customer);
    const syntheticSession: any = {
      access_token: 'demo-customer-session',
      user: { id: customer.id, email: customer.email },
    };
    setSession(syntheticSession);
    setUser(syntheticSession.user);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setActiveProfile(null);
    setViewRole('customer');
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const switchViewMode = (role: UserRole, vendorId?: string) => {
    setViewRole(role);
    if (role === 'customer') {
      setActiveProfile(profile);
    } else if (role === 'owner') {
      const selected = vendorList.find((v) => v.id === vendorId) || vendorList[0];
      setActiveProfile(selected);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        activeProfile,
        viewRole,
        loading,
        vendorList,
        signInWithOtp,
        verifyOtp,
        loginAsVendor,
        loginAsCustomer,
        signOut,
        refreshProfile,
        switchViewMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
