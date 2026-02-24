import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType, TxType } from '../types';
import { Camera, ArrowUpRight, ArrowDownRight, ArrowRightLeft, Plus, ChevronDown } from 'lucide-react';
import { scanReceipt } from '../services/geminiService';

const TransactionForm: React.FC = () => {
  const { accounts, addTransaction, formIntent, setFormIntent, language } = useApp();
  const t = TRANSLATIONS[language];
  
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await scanReceipt(base64, language);
        if (result) {
          setDescription(result.merchant || result.description || '');
          setAmount(result.amount?.toString() || '');
          if (result.date) setDate(result.date);
          setTxType('EXPENSE');
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Scan error:", error);
      setIsScanning(false);
    }
  };

  const getButtonConfig = () => {
    switch(txType) {
      case 'INCOME': return { text: t.addIncome, color: 'bg-emerald-600 shadow-emerald-600/20' };
      case 'TRANSFER': return { text: t.executeTransfer, color: 'bg-indigo-600 shadow-indigo-600/20' };
      default: return { text: t.bookExpense, color: 'bg-brand-primary shadow-brand-primary/20' };
    }
  };

  const config = getButtonConfig();

  const inputBaseClasses = "w-full bg-brand-muted/40 border border-brand-border rounded-xl px-4 py-3 text-sm font-semibold text-brand-text outline-none transition-all placeholder:text-brand-secondary/30 focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent/30 focus:bg-brand-surface";
  const labelBaseClasses = "text-[10px] font-bold text-brand-secondary uppercase tracking-wider ml-1 mb-2 block opacity-60";

  return (
    <div className="bg-brand-surface p-8 rounded-3xl shadow-sm border border-brand-border relative overflow-hidden flex flex-col gap-8 transition-all duration-500">
      <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-700 ease-in-out ${txType === 'INCOME' ? 'bg-emerald-500' : txType === 'TRANSFER' ? 'bg-indigo-500' : 'bg-brand-accent'}`} />
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-brand-text tracking-tight">
            New Entry
          </h3>
          <p className="text-[10px] font-bold text-brand-secondary/60 uppercase tracking-wider mt-1">Ledger Transaction</p>
        </div>
        <div className="flex gap-2">
          <label 
            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-brand-border transition-all cursor-pointer ${isScanning ? 'animate-pulse bg-brand-accent text-white' : 'bg-brand-muted/50 hover:bg-brand-muted text-brand-secondary hover:text-brand-text'}`}
            title="SmartScan OCR"
          >
            <Camera size={18} />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={isScanning}
            />
          </label>
          <div className="w-10 h-10 bg-brand-muted/50 rounded-xl flex items-center justify-center border border-brand-border text-brand-secondary">
            {txType === 'INCOME' ? <ArrowUpRight size={20} /> : txType === 'TRANSFER' ? <ArrowRightLeft size={20} /> : <ArrowDownRight size={20} />}
          </div>
        </div>
      </div>

      <div className="flex bg-brand-muted/50 rounded-xl p-1 gap-1 border border-brand-border/40">
        {(['EXPENSE', 'INCOME', 'TRANSFER'] as TxType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setTxType(type);
              setFormIntent(null);
            }}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
              txType === type 
                ? 'bg-brand-surface text-brand-text shadow-sm border border-brand-border' 
                : 'text-brand-secondary hover:text-brand-text hover:bg-brand-surface/50'
            }`}
          >
            {type === 'EXPENSE' ? t.expense : type === 'INCOME' ? t.income : t.transfer}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="w-full">
          <label className={labelBaseClasses}>{t.description}</label>
          <input 
            type="text" 
            required
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className={inputBaseClasses} 
            placeholder={txType === 'INCOME' ? "e.g. Monthly Salary Bonus" : "e.g. Starbucks Coffee"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelBaseClasses}>{t.amount}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-secondary opacity-30 text-sm">₹</span>
              <input 
                type="number" 
                required
                step="0.01"
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className={`${inputBaseClasses} pl-8 font-mono`} 
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
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

        <div className="space-y-4">
          <div>
            <label className={labelBaseClasses}>
              {txType === 'INCOME' ? t.source : t.fromAccount}
            </label>
            <div className="relative">
              <select 
                value={fromAccount} 
                onChange={e => setFromAccount(e.target.value)}
                className={`${inputBaseClasses} appearance-none pr-10 cursor-pointer`}
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
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-secondary opacity-40" size={16} />
            </div>
          </div>

          <div>
            <label className={labelBaseClasses}>
              {txType === 'EXPENSE' ? t.toAccount : t.destination}
            </label>
            <div className="relative">
              <select 
                value={toAccount} 
                onChange={e => setToAccount(e.target.value)}
                className={`${inputBaseClasses} appearance-none pr-10 cursor-pointer`}
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
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-secondary opacity-40" size={16} />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={`w-full text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-all mt-2 flex items-center justify-center gap-3 text-[10px] uppercase tracking-wider shadow-lg ${config.color} hover:opacity-90`}
        >
          <Plus size={16} />
          {config.text}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
