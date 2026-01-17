
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Account, Transaction, Theme, EntryType, AccountType, View, TransactionIntent, TxType } from '../types';
import { INITIAL_ACCOUNTS } from '../constants';

interface AppContextType extends AppState {
  setTheme: (t: Theme) => void;
  setView: (v: View) => void;
  setFormIntent: (intent: TransactionIntent | null) => void;
  addTransaction: (description: string, date: string, amount: number, fromAccountId: string, toAccountId: string) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (name: string, type: AccountType, emoji: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('finveda_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finveda_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('finveda_theme') as Theme) || 'light'
  );

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [formIntent, setFormIntent] = useState<TransactionIntent | null>(null);

  useEffect(() => {
    localStorage.setItem('finveda_accounts', JSON.stringify(accounts));
    localStorage.setItem('finveda_transactions', JSON.stringify(transactions));
    localStorage.setItem('finveda_theme', theme);
  }, [accounts, transactions, theme]);

  const addAccount = useCallback((name: string, type: AccountType, emoji: string) => {
    const newAcc: Account = {
      id: `acc-custom-${crypto.randomUUID()}`,
      name,
      type,
      balance: 0,
      emoji
    };
    setAccounts(prev => [...prev, newAcc]);
  }, []);

  const addTransaction = useCallback((
    description: string, 
    date: string, 
    amount: number, 
    fromAccountId: string, 
    toAccountId: string
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date,
      description,
      entries: [
        {
          id: crypto.randomUUID(),
          accountId: toAccountId,
          amount,
          type: EntryType.DEBIT,
          description,
          date
        },
        {
          id: crypto.randomUUID(),
          accountId: fromAccountId,
          amount,
          type: EntryType.CREDIT,
          description,
          date
        }
      ]
    };

    setTransactions(prev => [...prev, newTransaction]);

    setAccounts(prevAccounts => prevAccounts.map(acc => {
      let newBalance = acc.balance;
      if (acc.id === toAccountId) {
        const factor = (acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE) ? 1 : -1;
        newBalance += (amount * factor);
      }
      if (acc.id === fromAccountId) {
        const factor = (acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE) ? -1 : 1;
        newBalance += (amount * factor);
      }
      return { ...acc, balance: newBalance };
    }));
    
    setFormIntent(null);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prevTransactions => {
      const txToDelete = prevTransactions.find(t => t.id === id);
      if (!txToDelete) return prevTransactions;

      setAccounts(prevAccounts => prevAccounts.map(acc => {
        let balanceAdjustment = 0;
        
        txToDelete.entries.forEach(entry => {
          if (entry.accountId === acc.id) {
            if (entry.type === EntryType.DEBIT) {
              const factor = (acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE) ? 1 : -1;
              balanceAdjustment -= (entry.amount * factor);
            } else if (entry.type === EntryType.CREDIT) {
              const factor = (acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE) ? -1 : 1;
              balanceAdjustment -= (entry.amount * factor);
            }
          }
        });

        return { ...acc, balance: acc.balance + balanceAdjustment };
      }));

      return prevTransactions.filter(t => t.id !== id);
    });
  }, []);

  return (
    <AppContext.Provider value={{ 
      accounts, 
      transactions, 
      theme, 
      currentView,
      formIntent,
      setTheme, 
      setView: setCurrentView,
      setFormIntent,
      addTransaction,
      deleteTransaction,
      addAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
