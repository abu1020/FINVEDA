
export type Theme = 'light' | 'dark' | 'midnight' | 'emerald' | 'sunset';
export type View = 'dashboard' | 'transactions' | 'banking';
export type TxType = 'EXPENSE' | 'INCOME' | 'TRANSFER';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  emoji?: string;
}

export interface JournalEntry {
  id: string;
  accountId: string;
  amount: number;
  type: EntryType;
  description: string;
  date: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  entries: JournalEntry[];
}

export interface TransactionIntent {
  type: TxType;
  toAccountId?: string;
  fromAccountId?: string;
}

export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  theme: Theme;
  currentView: View;
  formIntent: TransactionIntent | null;
}
