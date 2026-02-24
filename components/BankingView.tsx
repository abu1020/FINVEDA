import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType } from '../types';
import { Plus, ArrowDownLeft, ArrowRightLeft, Landmark, TrendingUp, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BankingView: React.FC = () => {
  const { accounts, transactions, setView, setFormIntent, addAccount, language } = useApp();
  const t = TRANSLATIONS[language];

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-12"
    >
      <header className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-brand-text">Liquidity Hub</h2>
        <p className="text-brand-secondary text-sm font-medium opacity-70">
          Manage your capital nodes and revenue channels.
        </p>
      </header>

      {/* Asset Accounts Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-brand-border/60 pb-4">
           <div className="space-y-1">
             <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
               <Landmark size={20} className="text-brand-accent" />
               {t.assets}
             </h3>
             <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary opacity-50">Operational Liquidity</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bankAccounts.map((acc, index) => {
            const accTransactions = transactions.filter(tx => 
              tx.entries.some(e => e.accountId === acc.id)
            ).slice(-3).reverse();

            const isPrimary = index === 0;
            
            return (
              <div key={acc.id} className={`rounded-3xl p-8 shadow-sm relative overflow-hidden group border transition-all duration-300 hover:shadow-md ${isPrimary ? 'bg-brand-primary text-white border-brand-primary' : 'bg-brand-surface text-brand-text border-brand-border'}`}>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-500 group-hover:scale-105 ${isPrimary ? 'bg-white/10 border border-white/10' : 'bg-brand-muted border border-brand-border'}`}>
                    {acc.emoji}
                  </div>
                  <button className={`p-2 rounded-lg transition-colors ${isPrimary ? 'hover:bg-white/10' : 'hover:bg-brand-muted'}`}>
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="mb-8 relative z-10">
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60 ${isPrimary ? 'text-white' : 'text-brand-secondary'}`}>{acc.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight tabular-nums leading-none">₹{acc.balance.toLocaleString()}</span>
                  </div>
                </div>

                <div className={`mt-auto pt-6 border-t ${isPrimary ? 'border-white/10' : 'border-brand-border/60'} relative z-10`}>
                  <div className="space-y-3 mb-6">
                    {accTransactions.length === 0 ? (
                      <p className="text-[10px] font-medium opacity-30 italic">No recent activity</p>
                    ) : (
                      accTransactions.map(tx => {
                        const entry = tx.entries.find(e => e.accountId === acc.id);
                        return (
                          <div key={tx.id} className="flex justify-between items-center text-xs font-medium">
                            <span className="truncate pr-4 opacity-70">{tx.description}</span>
                            <span className={`font-mono font-bold ${entry?.type === 'CREDIT' ? (isPrimary ? 'text-rose-300' : 'text-rose-500') : (isPrimary ? 'text-emerald-300' : 'text-emerald-500')}`}>
                              {entry?.type === 'CREDIT' ? '-' : '+'}₹{entry?.amount.toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleAction('INCOME', acc.id)} 
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:opacity-90 ${isPrimary ? 'bg-white text-brand-primary' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                    >
                      <ArrowDownLeft size={14} />
                      Deposit
                    </button>
                    <button 
                      onClick={() => handleAction('TRANSFER', acc.id)} 
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:opacity-90 ${isPrimary ? 'bg-white/10 text-white' : 'bg-brand-muted text-brand-secondary'}`}
                    >
                      <ArrowRightLeft size={14} />
                      Transfer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Revenue Sources Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-brand-border/60 pb-4">
           <div className="space-y-1">
              <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Revenue Sources
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary opacity-50">Inbound Capital Nodes</p>
           </div>
           <button 
            onClick={() => setShowAddSource(true)}
            className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
           >
             <Plus size={16} />
             {t.addSource}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueAccounts.map(source => (
            <div key={source.id} className="bg-brand-surface border border-brand-border rounded-2xl p-6 hover:shadow-md transition-all duration-300 group flex flex-col">
              <div className="w-12 h-12 bg-brand-muted rounded-xl flex items-center justify-center text-2xl mb-4 border border-brand-border group-hover:scale-105 transition-transform duration-300">
                {source.emoji}
              </div>
              <h4 className="text-lg font-bold text-brand-text mb-1">{source.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary opacity-40 mb-6">Revenue Stream</p>
              
              <div className="mt-auto flex justify-between items-end">
                <span className="text-2xl font-bold text-brand-text tracking-tight tabular-nums">₹{source.balance.toLocaleString()}</span>
                <button 
                  onClick={() => handleAction('INCOME', source.id, true)}
                  className="w-10 h-10 bg-brand-accent/10 text-brand-accent rounded-xl flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all"
                  title="Capture Inflow"
                >
                  <ArrowDownLeft size={18} />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setShowAddSource(true)}
            className="h-full min-h-[180px] rounded-2xl border-2 border-dashed border-brand-border flex flex-col items-center justify-center p-6 transition-all hover:border-brand-accent hover:bg-brand-accent/[0.02] group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-muted flex items-center justify-center text-brand-secondary group-hover:bg-brand-accent group-hover:text-white transition-all mb-3">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary group-hover:text-brand-accent transition-colors">
              New Source
            </span>
          </button>
        </div>
      </section>

      {/* Modal for Adding Source */}
      <AnimatePresence>
        {showAddSource && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSource(false)}
              className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-surface w-full max-w-md rounded-3xl p-8 shadow-2xl border border-brand-border relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-brand-text tracking-tight">{t.addSource}</h3>
                <button onClick={() => setShowAddSource(false)} className="p-2 hover:bg-brand-muted rounded-lg transition-colors">
                  <X size={20} className="text-brand-secondary" />
                </button>
              </div>
              <form onSubmit={handleAddSource} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary opacity-60 ml-1">Source Name</label>
                  <input 
                    type="text" 
                    value={newSourceName}
                    onChange={e => setNewSourceName(e.target.value)}
                    className="w-full bg-brand-muted border border-brand-border rounded-xl px-4 py-3 font-semibold text-sm outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent/30 transition-all"
                    placeholder="e.g. Freelance Projects"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-brand-primary text-white font-bold py-3 rounded-xl uppercase tracking-wider text-[10px] shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-all">Establish Source</button>
                  <button type="button" onClick={() => setShowAddSource(false)} className="px-6 bg-brand-muted text-brand-secondary font-bold py-3 rounded-xl uppercase tracking-wider text-[10px] hover:bg-brand-border transition-all">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BankingView;
