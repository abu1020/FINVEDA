
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import BankingView from './components/BankingView';
import AIInsights from './components/AIInsights';
import { getThemeClass } from './constants';
import { AnimatePresence, motion } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentView, theme } = useApp();

  useEffect(() => {
    const body = document.body;
    const themeClass = getThemeClass(theme);
    body.className = `min-h-screen ${themeClass}`;
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard key="dashboard" />;
      case 'transactions': return <TransactionsView key="transactions" />;
      case 'banking': return <BankingView key="banking" />;
      default: return <Dashboard key="dashboard" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-bg transition-colors duration-500 relative font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
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
