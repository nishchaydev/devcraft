import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';
import { ProfileSetup } from '../profile/ProfileSetup';
import { CustomerDashboard } from '../dashboard/CustomerDashboard';
import { OwnerDashboard } from '../dashboard/OwnerDashboard';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { LogOut, Loader2, Store, User, Sparkles } from 'lucide-react';

export const AuthGate: React.FC = () => {
  const { session, profile, activeProfile, viewRole, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-[#626260] space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-[#ff5600] animate-spin" />
        <p className="text-xs font-semibold">Connecting to Fin AI Engine...</p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  if (session && !profile && viewRole === 'customer') {
    return <ProfileSetup />;
  }

  const currentActive = activeProfile || profile;

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#111111] flex flex-col font-sans selection:bg-[#ff5600] selection:text-white">
      {/* 🟢 INTERCOM / VIA-P.A.A.R. WARM CREAM TOP HEADER */}
      <header className="bg-[#faf8f5] border-b border-[#d3cec6] px-4 py-2.5 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ff5600] flex items-center justify-center font-black text-white text-sm shadow-md">
            ic
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#111111] tracking-wide flex items-center gap-2">
              via-P.A.A.R.
              <span className="text-[10px] bg-[#ff5600]/10 text-[#ff5600] px-2.5 py-0.5 rounded-full border border-[#ff5600]/30 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Fin AI Engine
              </span>
            </h1>
            <p className="text-[10px] text-[#626260]">Two-Way Chat & Fin AI Order Parser</p>
          </div>
        </div>

        {/* User / Store Badge & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#d3cec6] px-3 py-1.5 rounded-xl text-xs shadow-sm">
            {viewRole === 'owner' ? (
              <Store className="w-3.5 h-3.5 text-[#ff5600]" />
            ) : (
              <User className="w-3.5 h-3.5 text-[#ff5600]" />
            )}
            <span className="font-bold text-[#111111] truncate max-w-[180px] sm:max-w-none">
              {currentActive?.store_name || currentActive?.full_name || currentActive?.email || 'Logged In'}
            </span>
            <span className="text-[10px] bg-[#ff5600] text-white px-2 py-0.5 rounded-md uppercase font-black tracking-wider">
              {viewRole}
            </span>
          </div>

          <button
            onClick={signOut}
            className="p-2 bg-white hover:bg-rose-50 text-[#626260] hover:text-rose-600 border border-[#d3cec6] hover:border-rose-300 rounded-xl transition-all text-xs flex items-center gap-1.5 font-semibold shadow-sm"
            title="Sign Out & Switch Account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="flex-1 p-2 sm:p-4 max-w-7xl w-full mx-auto">
        <ErrorBoundary>
          {viewRole === 'customer' ? <CustomerDashboard /> : <OwnerDashboard />}
        </ErrorBoundary>
      </main>
    </div>
  );
};
