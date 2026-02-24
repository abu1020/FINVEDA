import React from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS, THEMES } from '../constants';
import { Theme } from '../types';
import { LayoutDashboard, ReceiptText, Landmark, Palette, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Sidebar: React.FC = () => {
  const { theme, setTheme, language, setLanguage, currentView, setView } = useApp();
  const t = TRANSLATIONS[language];

  return (
    <aside className="w-20 lg:w-72 bg-brand-surface border-r border-brand-border h-screen sticky top-0 flex flex-col z-40 transition-all duration-500 shadow-sm">
      {/* Brand Section */}
      <div 
        className="flex items-center gap-4 p-8 cursor-pointer group" 
        onClick={() => setView('dashboard')}
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-300">
            F
          </div>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold tracking-tight text-brand-text">FinVeda</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-brand-secondary opacity-60">Wealth Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <NavItem 
          active={currentView === 'dashboard'} 
          onClick={() => setView('dashboard')} 
          icon={<LayoutDashboard size={20} />} 
          label={t.dashboard} 
        />
        <NavItem 
          active={currentView === 'transactions'} 
          onClick={() => setView('transactions')} 
          icon={<ReceiptText size={20} />} 
          label={t.transactions} 
        />
        <NavItem 
          active={currentView === 'banking'} 
          onClick={() => setView('banking')} 
          icon={<Landmark size={20} />} 
          label={t.banking} 
        />
      </nav>

      {/* Footer Controls */}
      <div className="p-6 border-t border-brand-border/60 space-y-6">
        {/* Language Toggle */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 text-brand-secondary opacity-60 hidden lg:flex">
            <Languages size={14} />
            <p className="text-[10px] font-bold uppercase tracking-wider">Language</p>
          </div>
          <div className="flex gap-2 px-1">
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${language === 'en' ? 'bg-brand-primary text-white shadow-md' : 'bg-brand-muted text-brand-secondary hover:text-brand-text'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${language === 'hi' ? 'bg-brand-primary text-white shadow-md' : 'bg-brand-muted text-brand-secondary hover:text-brand-text'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 text-brand-secondary opacity-60 hidden lg:flex">
            <Palette size={14} />
            <p className="text-[10px] font-bold uppercase tracking-wider">Appearance</p>
          </div>
          <div className="flex lg:grid lg:grid-cols-5 gap-2 px-1 justify-center">
            {THEMES.map(th => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id as Theme)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${theme === th.id ? 'border-brand-accent ring-4 ring-brand-accent/10' : 'border-transparent opacity-40 hover:opacity-100'}`}
                style={{ 
                  backgroundColor: th.id === 'light' ? '#0f172a' : th.id === 'dark' ? '#2dd4bf' : th.id === 'midnight' ? '#6366f1' : th.id === 'emerald' ? '#10b981' : '#f43f5e' 
                }}
                title={th.name}
              >
                {theme === th.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
        active 
          ? 'bg-brand-primary/5 text-brand-primary font-semibold' 
          : 'text-brand-secondary hover:bg-brand-muted hover:text-brand-text'
      }`}
    >
      <span className={`shrink-0 transition-colors duration-300 ${active ? 'text-brand-accent' : 'group-hover:text-brand-text'}`}>
        {icon}
      </span>
      <span className="hidden lg:block truncate text-sm tracking-tight">{label}</span>
      <AnimatePresence>
        {active && (
          <motion.div 
            layoutId="activeNav"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-0 w-1 h-6 bg-brand-accent rounded-r-full" 
          />
        )}
      </AnimatePresence>
    </button>
  );
};

export default Sidebar;
