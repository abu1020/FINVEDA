
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType, TxType } from '../types';
import { scanReceipt } from '../services/geminiService';

const TransactionForm: React.FC = () => {
  const { accounts, addTransaction, formIntent, setFormIntent } = useApp();
  const t = TRANSLATIONS;
  
  const [txType, setTxType] = useState<TxType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (formIntent) {
      setTxType(formIntent.type);
      if (formIntent.fromAccountId) setFromAccount(formIntent.fromAccountId);
      if (formIntent.toAccountId) setToAccount(formIntent.toAccountId);
    }
  }, [formIntent]);

  useEffect(() => {
    if (formIntent) return;

    if (txType === 'EXPENSE') {
      setFromAccount('acc-bank');
      setToAccount('acc-exp-food');
    } else if (txType === 'INCOME') {
      setFromAccount('acc-rev-salary');
      setToAccount('acc-bank');
    } else if (txType === 'TRANSFER') {
      setFromAccount('acc-bank');
      setToAccount('acc-cash');
    }
  }, [txType, formIntent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !fromAccount || !toAccount) return;
    addTransaction(description, date, parseFloat(amount), fromAccount, toAccount);
    setDescription('');
    setAmount('');
    setFormIntent(null);
  };

  const handleMockScan = async () => {
    setIsScanning(true);
    // Simulate a short delay for "OCR analysis"
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we'd pass a base64 string from a file input
    // Here we mock the result based on common receipt patterns
    const mockData = {
      merchant: "Starbucks Coffee",
      amount: 450.50,
      date: new Date().toISOString().split('T')[0]
    };

    setDescription(mockData.merchant);
    setAmount(mockData.amount.toString());
    setDate(mockData.date);
    setTxType('EXPENSE');
    setIsScanning(false);
  };

  const getButtonConfig = () => {
    switch(txType) {
      case 'INCOME': return { text: t.addIncome, color: 'bg-emerald-600 shadow-xl shadow-emerald-600/20 active:bg-emerald-700' };
      case 'TRANSFER': return { text: t.executeTransfer, color: 'bg-indigo-600 shadow-xl shadow-indigo-600/20 active:bg-indigo-700' };
      default: return { text: t.bookExpense, color: 'bg-brand-primary shadow-xl shadow-brand-primary/20 active:bg-slate-800' };
    }
  };

  const config = getButtonConfig();

  const inputBaseClasses = "w-full bg-brand-muted/40 border border-brand-border rounded-2xl px-5 py-4 text-sm outline-none transition-all placeholder:text-brand-secondary/30 font-semibold text-brand-text focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent/30 focus:bg-brand-surface group-hover:bg-brand-muted/60";
  const labelBaseClasses = "text-[10px] font-extrabold text-brand-secondary uppercase tracking-[0.15em] ml-1 mb-2 block opacity-80";

  return (
    <div className="bg-brand-surface p-10 rounded-[3rem] shadow-2xl border border-brand-border relative overflow-hidden flex flex-col gap-10 transition-all duration-500">
      <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-700 ease-in-out ${txType === 'INCOME' ? 'bg-emerald-500' : txType === 'TRANSFER' ? 'bg-indigo-500' : 'bg-brand-accent'}`} />
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-brand-text tracking-tight">
            {txType === 'INCOME' ? t.income : txType === 'TRANSFER' ? t.transfer : t.expense}
          </h3>
          <p className="text-[10px] font-bold text-brand-secondary/60 uppercase tracking-widest mt-1">Immutable Ledger Entry</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handleMockScan}
            disabled={isScanning}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-brand-border transition-all ${isScanning ? 'animate-pulse bg-brand-accent text-white' : 'bg-brand-muted/50 hover:bg-brand-muted text-brand-secondary hover:text-brand-text'}`}
            title="SmartScan OCR"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="w-12 h-12 bg-brand-muted/50 rounded-2xl flex items-center justify-center border border-brand-border text-2xl">
            {txType === 'INCOME' ? '↗️' : txType === 'TRANSFER' ? '↔️' : '↘️'}
          </div>
        </div>
      </div>

      <div className="flex bg-brand-muted/50 rounded-2xl p-1.5 gap-1 border border-brand-border/40">
        {(['EXPENSE', 'INCOME', 'TRANSFER'] as TxType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setTxType(type);
              setFormIntent(null);
            }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
              txType === type 
                ? 'bg-brand-surface text-brand-text shadow-md border border-brand-border scale-[1.02]' 
                : 'text-brand-secondary hover:text-brand-text hover:bg-brand-surface/50'
            }`}
          >
            {type === 'EXPENSE' ? t.expense : type === 'INCOME' ? t.income : t.transfer}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="w-full group">
          <label className={labelBaseClasses}>{t.description}</label>
          <input 
            type="text" 
            required
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className={inputBaseClasses} 
            placeholder={txType === 'INCOME' ? "e.g. Monthly Salary Bonus" : "e.g. Starbucks - Morning Coffee"}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="group">
            <label className={labelBaseClasses}>{t.amount}</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-brand-secondary opacity-30 text-base">₹</span>
              <input 
                type="number" 
                required
                step="0.01"
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className={`${inputBaseClasses} pl-10 font-mono text-base`} 
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="group">
            <label className={labelBaseClasses}>{t.date}</label>
            <input 
              type="date" 
              required
              value={date} 
              onChange={e => setDate(e.target.value)}
              className={`${inputBaseClasses} font-mono`} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="group">
            <label className={labelBaseClasses}>
              {txType === 'INCOME' ? t.source : t.fromAccount}
            </label>
            <div className="relative">
              <select 
                value={fromAccount} 
                onChange={e => setFromAccount(e.target.value)}
                className={`${inputBaseClasses} appearance-none pr-12 cursor-pointer transition-all`}
              >
                {txType === 'INCOME' 
                  ? accounts.filter(a => a.type === AccountType.REVENUE).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.emoji} {acc.name}</option>
                  ))
                  : accounts.filter(a => a.type === AccountType.ASSET).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.emoji} {acc.name} (₹{acc.balance.toLocaleString()})</option>
                  ))
                }
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-secondary opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="group">
            <label className={labelBaseClasses}>
              {txType === 'EXPENSE' ? t.toAccount : t.destination}
            </label>
            <div className="relative">
              <select 
                value={toAccount} 
                onChange={e => setToAccount(e.target.value)}
                className={`${inputBaseClasses} appearance-none pr-12 cursor-pointer transition-all ${
                  txType === 'INCOME' ? 'border-emerald-500/20 focus:ring-emerald-500/5 focus:border-emerald-500/40' : ''
                }`}
              >
                {txType === 'EXPENSE' 
                  ? accounts.filter(a => a.type === AccountType.EXPENSE).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.emoji} {acc.name}</option>
                  ))
                  : accounts.filter(a => a.type === AccountType.ASSET).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.emoji} {acc.name} (₹{acc.balance.toLocaleString()})</option>
                  ))
                }
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-secondary opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={`w-full text-white font-black py-5 rounded-[1.5rem] active:scale-[0.97] transition-all mt-4 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.25em] ${config.color} hover:brightness-110 hover:shadow-2xl`}
        >
          <div className="bg-white/20 p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          {config.text}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
