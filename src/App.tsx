import React, { useState, useEffect } from 'react';
import { IntakeView } from './views/IntakeView';
import { OrdersView } from './views/OrdersView';
import { AnalyticsView } from './views/AnalyticsView';
import { seedInitialDemoOrders } from './db/demoSeeder';

type Tab = 'intake' | 'orders' | 'analytics';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('intake');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial silent check and seed if database is empty
    seedInitialDemoOrders(false);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Shell */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-500/30">
            D
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              DevCraft OMS <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-800/60 font-mono">v2.0 Shell</span>
            </h1>
            <p className="text-[11px] text-slate-400">Offline-First Micro-Business Engine</p>
          </div>
        </div>

        {/* Network & Engine Status Badges */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 shadow-sm transition-all ${
            isOnline 
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' 
              : 'bg-amber-950/80 border-amber-500/40 text-amber-400 animate-pulse'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`}></span>
            {isOnline ? 'ONLINE' : 'AIRPLANE MODE'}
          </span>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 pb-24 max-w-5xl w-full mx-auto p-4">
        {activeTab === 'intake' && <IntakeView />}
        {activeTab === 'orders' && <OrdersView onNewOrderClick={() => setActiveTab('intake')} />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Streamlined 3-Tab Bottom Floating Navigation Dock */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-2xl flex items-center gap-2 shadow-2xl">
        <button
          onClick={() => setActiveTab('intake')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'intake'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">➕</span>
          <span>Intake</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">📋</span>
          <span>Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">⚡</span>
          <span>Operational Queries</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
