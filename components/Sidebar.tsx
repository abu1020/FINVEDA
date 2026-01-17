
import React from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS, THEMES } from '../constants';
import { Theme } from '../types';

const Sidebar: React.FC = () => {
  const { theme, setTheme, currentView, setView } = useApp();
  const t = TRANSLATIONS;

  return (
    <aside className="w-24 lg:w-96 bg-brand-surface border-r border-brand-border h-screen sticky top-0 flex flex-col p-10 z-40 transition-all duration-700 shadow-[10px_0_40px_-15px_rgba(0,0,0,0.02)]">
      {/* Brand Section */}
      <div 
        className="flex items-center gap-6 mb-20 px-4 cursor-pointer group" 
        onClick={() => setView('dashboard')}
      >
        <div className="relative shrink-0">
          <div className="w-14 h-14 bg-brand-primary rounded-[1.75rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-brand-primary/30 group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700">
            F
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-accent border-[5px] border-brand-surface rounded-full shadow-lg"></div>
        </div>
        <div className="hidden lg:block space-y-0.5">
          <h1 className="text-3xl font-black tracking-tighter text-brand-text leading-none">FinVeda</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary opacity-40">Wealth Engine v4.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4">
        <NavItem active={currentView === 'dashboard'} onClick={() => setView('dashboard')} icon="grid" label={t.dashboard} />
        <NavItem active={currentView === 'transactions'} onClick={() => setView('transactions')} icon="list" label={t.transactions} />
        <NavItem active={currentView === 'banking'} onClick={() => setView('banking')} icon="wallet" label={t.banking} />
      </nav>

      {/* Footer Controls */}
      <div className="mt-auto space-y-12 pt-12 border-t border-brand-border/60">
        <div className="space-y-5">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-secondary opacity-40 px-6 hidden lg:block">System Visuals</p>
          <div className="flex lg:grid lg:grid-cols-5 gap-3 px-3 justify-center">
            {THEMES.map(th => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id as Theme)}
                className={`w-8 h-8 rounded-full border-[3px] transition-all duration-500 hover:scale-125 active:scale-90 flex items-center justify-center ${theme === th.id ? 'border-brand-accent ring-[6px] ring-brand-accent/5' : 'border-transparent opacity-40 hover:opacity-100 shadow-sm'}`}
                style={{ 
                  backgroundColor: th.id === 'light' ? '#0f172a' : th.id === 'dark' ? '#2dd4bf' : th.id === 'midnight' ? '#6366f1' : th.id === 'emerald' ? '#10b981' : '#f43f5e' 
                }}
                title={th.name}
              >
                {theme === th.id && <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => {
  const getIcon = (name: string) => {
    switch(name) {
      case 'grid': return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
      case 'list': return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
      case 'wallet': return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
      default: return <span>•</span>;
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-6 px-7 py-5 rounded-[2.25rem] transition-all duration-700 relative overflow-hidden group ${
        active 
          ? 'bg-brand-primary text-white shadow-3xl shadow-brand-primary/20 scale-[1.03] border-none' 
          : 'text-brand-secondary hover:bg-brand-muted/60 hover:text-brand-text'
      }`}
    >
      <span className={`shrink-0 transition-transform duration-700 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>{getIcon(icon)}</span>
      <span className="hidden lg:block truncate font-black text-lg tracking-tight">{label}</span>
      {active && (
        <div className="absolute right-0 top-0 w-2 h-full bg-brand-accent shadow-[0_0_20px_rgba(var(--color-accent),0.5)]" />
      )}
    </button>
  );
};

export default Sidebar;
