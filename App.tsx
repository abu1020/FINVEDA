
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import BankingView from './components/BankingView';
import AIInsights from './components/AIInsights';
import { getThemeClass } from './constants';

const AppContent: React.FC = () => {
  const { currentView, theme } = useApp();

  useEffect(() => {
    const body = document.body;
    const themeClass = getThemeClass(theme);
    body.className = `min-h-screen ${themeClass}`;
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <TransactionsView />;
      case 'banking': return <BankingView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-bg transition-colors duration-500 relative">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {renderView()}
        </div>
      </main>
      <AIInsights />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
