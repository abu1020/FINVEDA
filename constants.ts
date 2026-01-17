
import { AccountType, Account, Theme } from './types';

export const TRANSLATIONS = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  banking: "Accounts & Sources",
  income: "Income",
  expense: "Expense",
  transfer: "Transfer",
  assets: "Assets",
  liabilities: "Liabilities",
  equity: "Equity",
  addTransaction: "Add Transaction",
  amount: "Amount",
  category: "Category",
  account: "Account",
  description: "Description",
  date: "Date",
  save: "Save",
  cancel: "Cancel",
  totalBalance: "Total Balance",
  recentActivity: "Recent Activity",
  theme: "Theme",
  bookExpense: "Book Expense",
  addIncome: "Add Income",
  executeTransfer: "Execute Transfer",
  fromAccount: "From Account",
  toAccount: "To Account",
  delete: "Delete",
  confirmDelete: "Are you sure you want to delete this transaction?",
  source: "Income Source",
  destination: "Deposit To",
  revenueStreams: "Revenue Streams",
  addSource: "Add Income Source",
  sourceName: "Source Name",
  manageSources: "Manage your income channels",
  aiInsights: "Wealth AI Insights",
  analyzing: "Analyzing ledger...",
  askAI: "Ask FinVeda AI..."
};

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-cash', name: 'Cash', type: AccountType.ASSET, balance: 1000, emoji: '💵' },
  { id: 'acc-bank', name: 'Savings Bank', type: AccountType.ASSET, balance: 5000, emoji: '🏦' },
  { id: 'acc-equity-opening', name: 'Opening Balance', type: AccountType.EQUITY, balance: 6000, emoji: '⚖️' },
  { id: 'acc-exp-food', name: 'Food & Dining', type: AccountType.EXPENSE, balance: 0, emoji: '🍔' },
  { id: 'acc-exp-rent', name: 'Rent', type: AccountType.EXPENSE, balance: 0, emoji: '🏠' },
  { id: 'acc-exp-utils', name: 'Utilities', type: AccountType.EXPENSE, balance: 0, emoji: '⚡' },
  { id: 'acc-rev-salary', name: 'Main Salary', type: AccountType.REVENUE, balance: 0, emoji: '💼' },
  { id: 'acc-rev-gifts', name: 'Gifts/Other', type: AccountType.REVENUE, balance: 0, emoji: '🎁' },
];

export const THEMES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'midnight', name: 'Midnight' },
  { id: 'emerald', name: 'Emerald' },
  { id: 'sunset', name: 'Sunset' },
];

export const getThemeClass = (themeId: Theme): string => {
  return themeId === 'light' ? '' : `theme-${themeId}`;
};
