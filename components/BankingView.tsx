
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType } from '../types';

const BankingView: React.FC = () => {
  const { accounts, transactions, setView, setFormIntent, addAccount } = useApp();
  const t = TRANSLATIONS;

  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceEmoji, setNewSourceEmoji] = useState('💰');

  const bankAccounts = accounts.filter(a => a.type === AccountType.ASSET);
  const revenueAccounts = accounts.filter(a => a.type === AccountType.REVENUE);

  const handleAction = (type: 'INCOME' | 'TRANSFER', id: string, isRevenue: boolean = false) => {
    if (isRevenue) {
      setFormIntent({ type: 'INCOME', fromAccountId: id });
    } else {
      setFormIntent({ type, toAccountId: type === 'INCOME' ? id : undefined, fromAccountId: type === 'TRANSFER' ? id : undefined });
    }
    setView('transactions');
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName) return;
    addAccount(newSourceName, AccountType.REVENUE, newSourceEmoji);
    setNewSourceName('');
    setShowAddSource(false);
  };

  return (
    <div className="p-8 lg:p-16 max-w-[1600px] mx-auto w-full space-y-20 animate-slide-up">
      <header className="space-y-4">
        <h2 className="text-6xl font-black tracking-tighter text-brand-text mb-2">Liquidity Hub</h2>
        <p className="text-brand-secondary font-bold text-xl tracking-tight max-w-2xl opacity-80 leading-snug">
          Multi-channel capital management and revenue node configuration.
        </p>
      </header>

      {/* Asset Accounts Section */}
      <section className="space-y-12">
        <div className="flex justify-between items-end border-b border-brand-border/60 pb-8">
           <div className="space-y-1">
             <h3 className="text-3xl font-black text-brand-text tracking-tight">{t.assets}</h3>
             <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-secondary opacity-50">Operational Liquidity</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {bankAccounts.map((acc, index) => {
            const accTransactions = transactions.filter(tx => 
              tx.entries.some(e => e.accountId === acc.id)
            ).slice(-4).reverse();

            const isPrimary = index === 0;
            const bgStyle = isPrimary 
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none' 
              : 'bg-brand-surface text-brand-text border border-brand-border';
            
            return (
              <div key={acc.id} className={`${bgStyle} rounded-[4rem] p-12 shadow-4xl relative overflow-hidden group bento-card flex flex-col min-h-[520px]`}>
                <div className="flex justify-between items-start mb-14 relative z-10">
                  <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner backdrop-blur-md transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 ${isPrimary ? 'bg-white/10 border border-white/20' : 'bg-brand-muted border border-brand-border'}`}>
                    {acc.emoji}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${isPrimary ? 'bg-white/20 border border-white/20' : 'bg-brand-muted border border-brand-border'}`}>
                    Active Node
                  </div>
                </div>

                <div className="mb-14 relative z-10">
                  <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 opacity-50 ${isPrimary ? 'text-white' : 'text-brand-secondary'}`}>{acc.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter tabular-nums leading-none">₹{acc.balance.toLocaleString()}</span>
                  </div>
                </div>

                <div className={`mt-auto pt-10 border-t ${isPrimary ? 'border-white/10' : 'border-brand-border/60'} relative z-10`}>
                  <div className="space-y-5 mb-10">
                    {accTransactions.length === 0 ? (
                      <p className="text-[11px] font-black uppercase tracking-widest opacity-30 italic">No recent flow.</p>
                    ) : (
                      accTransactions.map(tx => {
                        const entry = tx.entries.find(e => e.accountId === acc.id);
                        return (
                          <div key={tx.id} className="flex justify-between items-center text-[13px] font-bold">
                            <span className="truncate pr-4 opacity-60 group-hover:opacity-100 transition-opacity">{tx.description}</span>
                            <span className={`font-mono font-black ${entry?.type === 'CREDIT' ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {entry?.type === 'CREDIT' ? '-' : '+'}₹{entry?.amount.toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleAction('INCOME', acc.id)} className={`py-4.5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 hover:scale-[1.05] ${isPrimary ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-500/10'}`}>Deposit</button>
                    <button onClick={() => handleAction('TRANSFER', acc.id)} className={`py-4.5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 hover:scale-[1.05] ${isPrimary ? 'bg-white/10 text-white backdrop-blur-sm' : 'bg-brand-muted text-brand-secondary'}`}>Transfer</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Revenue Sources Section */}
      <section className="space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-10 border-b border-brand-border/60 pb-8">
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-brand-text tracking-tight">Revenue Sources</h3>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-secondary opacity-50">Inbound Capital Nodes</p>
           </div>
           <button 
            onClick={() => setShowAddSource(true)}
            className="px-12 py-5 bg-brand-primary text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-3xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
           >
             <span className="text-2xl font-light group-hover:rotate-90 transition-transform duration-500 leading-none">+</span>
             {t.addSource}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {revenueAccounts.map(source => (
            <div key={source.id} className="bg-brand-surface border border-brand-border rounded-[3.5rem] p-10 bento-card flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-muted/40 rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:bg-brand-accent/5 transition-colors" />
              <div className="w-16 h-16 bg-brand-muted rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-inner border border-brand-border group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10">
                {source.emoji}
              </div>
              <h4 className="text-2xl font-black text-brand-text mb-2 relative z-10 leading-none">{source.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-secondary opacity-40 mb-10 relative z-10">Historical Growth</p>
              
              <div className="mt-auto flex justify-between items-end relative z-10">
                <span className="text-3xl font-black text-brand-text tracking-tighter tabular-nums">₹{source.balance.toLocaleString()}</span>
                <button 
                  onClick={() => handleAction('INCOME', source.id, true)}
                  className="w-14 h-14 bg-brand-accent text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-accent/30 hover:scale-110 active:scale-90 transition-all group-hover:shadow-brand-accent/50"
                  title="Capture Inflow"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Prompting Add Source Card */}
          <button 
            onClick={() => setShowAddSource(true)}
            className="relative group h-full min-h-[280px] rounded-[3.5rem] border-2 border-dashed border-brand-border flex flex-col items-center justify-center p-12 transition-all hover:border-brand-accent hover:bg-brand-accent/[0.03] cursor-pointer"
          >
            <div className="w-16 h-16 rounded-3xl bg-brand-muted flex items-center justify-center text-3xl text-brand-secondary group-hover:bg-brand-accent group-hover:text-white group-hover:scale-110 transition-all shadow-inner group-hover:shadow-brand-accent/30 mb-6">
              +
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-secondary group-hover:text-brand-accent transition-colors text-center">
              New Node
            </span>
          </button>
        </div>
      </section>

      {/* Modal for Adding Source */}
      {showAddSource && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-brand-primary/20 backdrop-blur-md">
          <div className="bg-brand-surface w-full max-w-lg rounded-[4rem] p-14 shadow-6xl border border-brand-border animate-in zoom-in-95 fade-in duration-500">
            <h3 className="text-3xl font-black text-brand-text mb-10 tracking-tight">{t.addSource}</h3>
            <form onSubmit={handleAddSource} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-secondary opacity-60 ml-2">{t.sourceName}</label>
                <input 
                  type="text" 
                  value={newSourceName}
                  onChange={e => setNewSourceName(e.target.value)}
                  className="w-full bg-brand-muted border border-brand-border rounded-[1.75rem] p-5 font-bold text-lg outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all placeholder:text-brand-secondary/30"
                  placeholder="e.g. Real Estate Portfolio"
                  autoFocus
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-brand-primary text-white font-black py-5 rounded-[1.75rem] uppercase tracking-widest text-xs shadow-3xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95 transition-all">Establish Source</button>
                <button type="button" onClick={() => setShowAddSource(false)} className="px-8 bg-brand-muted text-brand-secondary font-black py-5 rounded-[1.75rem] uppercase tracking-widest text-xs hover:bg-brand-border transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingView;
