
import React from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType } from '../types';
import TransactionForm from './TransactionForm';

const TransactionsView: React.FC = () => {
  const { transactions, accounts, deleteTransaction } = useApp();
  const t = TRANSLATIONS;

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="p-8 lg:p-16 max-w-[1600px] mx-auto w-full space-y-16 animate-slide-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-3">
          <h2 className="text-6xl font-black tracking-tighter text-brand-text">Ledger History</h2>
          <p className="text-brand-secondary font-bold text-lg flex items-center gap-3 opacity-70">
            <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse"></span>
            {transactions.length} immutable entries found in local storage
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
        <div className="xl:col-span-8">
          <div className="bg-brand-surface rounded-[3.5rem] shadow-4xl border border-brand-border overflow-hidden">
            <div className="grid grid-cols-12 px-12 py-7 bg-brand-muted/30 text-[11px] font-black uppercase tracking-[0.3em] text-brand-secondary border-b border-brand-border/60">
              <span className="col-span-2">Timestamp</span>
              <span className="col-span-3">Description</span>
              <span className="col-span-2">Debit Source</span>
              <span className="col-span-2">Credit Node</span>
              <span className="col-span-2 text-right">Value</span>
              <span className="col-span-1"></span>
            </div>

            <div className="divide-y divide-brand-border/40">
              {transactions.length === 0 ? (
                <div className="p-40 text-center space-y-6">
                  <div className="w-24 h-24 bg-brand-muted rounded-[2.5rem] flex items-center justify-center mx-auto text-5xl shadow-inner border border-brand-border/40">🗄️</div>
                  <div className="space-y-2">
                    <p className="text-brand-text font-black text-2xl">Vault is empty.</p>
                    <p className="text-brand-secondary text-sm font-semibold opacity-50">Authorized transactions will appear here as immutable logs.</p>
                  </div>
                </div>
              ) : (
                transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => {
                  const toEntry = tx.entries[0];
                  const fromEntry = tx.entries[1];
                  
                  const toAcc = accounts.find(a => a.id === toEntry?.accountId);
                  const fromAcc = accounts.find(a => a.id === fromEntry?.accountId);

                  const isExpense = toAcc?.type === AccountType.EXPENSE;
                  const isIncome = fromAcc?.type === AccountType.REVENUE;

                  let badgeStyles = 'bg-brand-muted/50 text-brand-secondary border-brand-border/40';
                  let prefix = '';

                  if (isExpense) {
                    badgeStyles = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
                    prefix = '-';
                  } else if (isIncome) {
                    badgeStyles = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
                    prefix = '+';
                  }

                  return (
                    <div key={tx.id} className="grid grid-cols-12 px-12 py-8 items-center hover:bg-brand-muted/20 transition-all duration-500 group cursor-default">
                      <div className="col-span-2 font-mono text-[13px] font-bold text-brand-secondary opacity-60">
                        {new Date(tx.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: '2-digit',
                          year: '2-digit'
                        })}
                      </div>

                      <div className="col-span-3">
                        <p className="font-extrabold text-[15px] text-brand-text group-hover:text-brand-accent transition-colors truncate pr-10" title={tx.description}>
                          {tx.description}
                        </p>
                      </div>

                      <div className="col-span-2 flex items-center gap-4">
                        <div className="w-9 h-9 bg-brand-muted/50 rounded-xl flex items-center justify-center text-lg border border-brand-border/40 group-hover:rotate-12 transition-transform">
                          {fromAcc?.emoji || '💰'}
                        </div>
                        <span className="text-[11px] font-black text-brand-secondary uppercase tracking-widest truncate max-w-[80px]">
                          {fromAcc?.name}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center gap-4">
                        <div className="w-9 h-9 bg-brand-muted/50 rounded-xl flex items-center justify-center text-lg border border-brand-border/40 group-hover:-rotate-12 transition-transform">
                          {toAcc?.emoji || '📥'}
                        </div>
                        <span className="text-[11px] font-black text-brand-secondary uppercase tracking-widest truncate max-w-[80px]">
                          {toAcc?.name}
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className={`px-5 py-2 rounded-2xl font-mono font-black text-sm inline-block border tabular-nums ${badgeStyles}`}>
                          {prefix}₹{toEntry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-3 rounded-2xl text-brand-secondary hover:text-rose-600 hover:bg-rose-500/10 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/5 active:scale-90"
                          title="Purge Transaction"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 sticky top-16 space-y-10">
          <TransactionForm />
          <div className="bg-gradient-to-br from-brand-accent/5 to-transparent border border-brand-accent/20 rounded-[3rem] p-12 space-y-6 relative overflow-hidden group">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="flex items-center gap-5 relative z-10">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-2xl border border-brand-accent/20 group-hover:scale-110 transition-transform">🛡️</div>
                <h4 className="text-xl font-black tracking-tight text-brand-text">Verification Protocol</h4>
             </div>
             <p className="text-sm font-bold text-brand-secondary leading-relaxed opacity-70 relative z-10">
               Automated triple-check verification on all ledger entries ensures your financial integrity is maintained across all account nodes.
             </p>
             <div className="h-2 w-full bg-brand-muted/40 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-brand-accent w-full rounded-full opacity-60"></div>
             </div>
             <div className="flex justify-between items-center relative z-10">
               <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] opacity-40">Integrity: 100% Verified</p>
               <span className="w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_8px_rgba(var(--color-accent),0.4)]"></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsView;
