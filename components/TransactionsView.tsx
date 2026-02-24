import React from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType } from '../types';
import TransactionForm from './TransactionForm';
import { Trash2, History, ShieldCheck, Search } from 'lucide-react';
import { motion } from 'motion/react';

const TransactionsView: React.FC = () => {
  const { transactions, accounts, deleteTransaction, language } = useApp();
  const t = TRANSLATIONS[language];

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      deleteTransaction(id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full space-y-8"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-brand-text flex items-center gap-3">
            <History size={28} className="text-brand-accent" />
            Ledger History
          </h2>
          <p className="text-brand-secondary font-medium text-sm flex items-center gap-2 opacity-70">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {transactions.length} verified entries in local storage
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary opacity-40" size={16} />
          <input 
            type="text" 
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-brand-border rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8">
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 px-6 py-4 bg-brand-muted/30 text-[10px] font-bold uppercase tracking-wider text-brand-secondary border-b border-brand-border/60">
              <span className="col-span-2">Date</span>
              <span className="col-span-4">Description</span>
              <span className="col-span-3">Accounts (From → To)</span>
              <span className="col-span-2 text-right">Amount</span>
              <span className="col-span-1"></span>
            </div>

            <div className="divide-y divide-brand-border/40">
              {transactions.length === 0 ? (
                <div className="py-32 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-muted rounded-2xl flex items-center justify-center mx-auto text-3xl border border-brand-border/40">📂</div>
                  <div className="space-y-1">
                    <p className="text-brand-text font-bold text-lg">No records found</p>
                    <p className="text-brand-secondary text-xs font-medium opacity-50">Transactions will appear here as you add them.</p>
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

                  let amountStyles = 'text-brand-text';
                  let prefix = '';

                  if (isExpense) {
                    amountStyles = 'text-rose-600';
                    prefix = '-';
                  } else if (isIncome) {
                    amountStyles = 'text-emerald-600';
                    prefix = '+';
                  }

                  return (
                    <div key={tx.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-brand-muted/20 transition-all duration-300 group">
                      <div className="col-span-2 text-xs font-medium text-brand-secondary opacity-70">
                        {new Date(tx.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: '2-digit',
                          year: 'numeric'
                        })}
                      </div>

                      <div className="col-span-4">
                        <p className="font-bold text-sm text-brand-text truncate pr-4" title={tx.description}>
                          {tx.description}
                        </p>
                      </div>

                      <div className="col-span-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider truncate max-w-[60px]" title={fromAcc?.name}>
                          {fromAcc?.name}
                        </span>
                        <span className="text-brand-secondary opacity-30">→</span>
                        <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider truncate max-w-[60px]" title={toAcc?.name}>
                          {toAcc?.name}
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className={`font-mono font-bold text-sm tabular-nums ${amountStyles}`}>
                          {prefix}₹{toEntry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-brand-secondary hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
                          title="Delete Transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 sticky top-10 space-y-6">
          <TransactionForm />
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent border border-brand-accent/20">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-sm font-bold text-brand-text">Data Integrity</h4>
             </div>
             <p className="text-xs font-medium text-brand-secondary leading-relaxed opacity-70">
               All ledger entries are verified against double-entry standards. Your financial data is stored locally and remains private.
             </p>
             <div className="pt-2">
               <div className="h-1.5 w-full bg-brand-muted rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent w-full rounded-full opacity-40"></div>
               </div>
               <div className="flex justify-between items-center mt-2">
                 <p className="text-[9px] font-bold text-brand-secondary uppercase tracking-wider opacity-40">Status: Verified</p>
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionsView;
