
import { AccountType, Account, Theme } from './types';

export const TRANSLATIONS = {
  en: {
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
  },
  hi: {
    dashboard: "डैशबोर्ड",
    transactions: "लेन-देन",
    banking: "खाते और स्रोत",
    income: "आय",
    expense: "व्यय",
    transfer: "स्थानांतरण",
    assets: "संपत्ति",
    liabilities: "देनदारियां",
    equity: "इक्विटी",
    addTransaction: "लेन-देन जोड़ें",
    amount: "राशि",
    category: "श्रेणी",
    account: "खाता",
    description: "विवरण",
    date: "तारीख",
    save: "सहेजें",
    cancel: "रद्द करें",
    totalBalance: "कुल शेष",
    recentActivity: "हाल की गतिविधि",
    theme: "थीम",
    bookExpense: "खर्च दर्ज करें",
    addIncome: "आय जोड़ें",
    executeTransfer: "स्थानांतरण करें",
    fromAccount: "खाते से",
    toAccount: "खाते में",
    delete: "हटाएं",
    confirmDelete: "क्या आप वाकई इस लेन-देन को हटाना चाहते हैं?",
    source: "आय का स्रोत",
    destination: "जमा करें",
    revenueStreams: "राजस्व धाराएं",
    addSource: "आय का स्रोत जोड़ें",
    sourceName: "स्रोत का नाम",
    manageSources: "अपने आय चैनलों को प्रबंधित करें",
    aiInsights: "वेल्थ एआई अंतर्दृष्टि",
    analyzing: "बहीखाता का विश्लेषण...",
    askAI: "FinVeda AI से पूछें..."
  }
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
