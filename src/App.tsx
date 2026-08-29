import { useState } from 'react';
import { Header } from './components/Header';
import { InstallPrompt } from './components/InstallPrompt';
import { IntakeView } from './views/IntakeView';
import { OrdersView } from './views/OrdersView';
import { ConflictView } from './views/ConflictView';
import { AnalyticsView } from './views/AnalyticsView';
import { BatchEvalView } from './views/BatchEvalView';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PlusCircle, ListOrdered, AlertTriangle, BarChart3, FileCheck } from 'lucide-react';

function AppContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'intake' | 'orders' | 'conflicts' | 'analytics' | 'eval'>('intake');

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />

      <main style={{ flex: 1 }}>
        {activeTab === 'intake' && <IntakeView onOrderCreated={() => setActiveTab('orders')} />}
        {activeTab === 'orders' && <OrdersView onNewOrderClick={() => setActiveTab('intake')} />}
        {activeTab === 'conflicts' && <ConflictView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'eval' && <BatchEvalView />}
      </main>

      <InstallPrompt />

      {/* Bottom Navigation Bar */}
      <nav className="nav-bar">
        <button
          onClick={() => setActiveTab('intake')}
          className={`nav-item ${activeTab === 'intake' ? 'active' : ''}`}
        >
          <PlusCircle size={20} />
          <span>{t('intakeTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ListOrdered size={20} />
          <span>{t('ordersTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`nav-item ${activeTab === 'conflicts' ? 'active' : ''}`}
        >
          <AlertTriangle size={20} />
          <span>{t('conflictsTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 size={20} />
          <span>{t('analyticsTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('eval')}
          className={`nav-item ${activeTab === 'eval' ? 'active' : ''}`}
        >
          <FileCheck size={20} />
          <span>{t('evalTab')}</span>
        </button>
      </nav>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
