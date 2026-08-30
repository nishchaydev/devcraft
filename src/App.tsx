import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthGate } from './components/auth/AuthGate';
import { InstallPrompt } from './components/InstallPrompt';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#111111] font-sans selection:bg-[#ff5600] selection:text-white">
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <InstallPrompt />
    </div>
  );
};

export default App;
