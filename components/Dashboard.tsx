import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Activity, Zap, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { accounts, transactions, setView, setFormIntent, language } = useApp();
  const t = TRANSLATIONS[language];

  const summary = useMemo(() => {
    const assets = accounts.filter(a => a.type === AccountType.ASSET).reduce((sum, a) => sum + a.balance, 0);
    const expenses = accounts.filter(a => a.type === AccountType.EXPENSE).reduce((sum, a) => sum + a.balance, 0);
    const income = accounts.filter(a => a.type === AccountType.REVENUE).reduce((sum, a) => sum + a.balance, 0);
    return { assets, expenses, income };
  }, [accounts]);

  const handleQuickAction = (mode: 'INCOME' | 'EXPENSE') => {
    setFormIntent({ type: mode });
    setView('transactions');
  };

  const recentTransactions = transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 lg:p-10 space-y-8 max-w-[1400px] mx-auto w-full"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-brand-text">
            Financial Overview
          </h2>
          <p className="text-brand-secondary text-sm font-medium opacity-70">
            Monitor your liquidity and capital flow in real-time.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => handleQuickAction('INCOME')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-surface text-brand-text border border-brand-border rounded-xl shadow-sm hover:bg-brand-muted transition-all duration-300 text-sm font-semibold"
          >
            <Plus size={18} className="text-emerald-500" />
            Deposit
          </button>
          
          <button 
            onClick={() => handleQuickAction('EXPENSE')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-all duration-300 text-sm font-semibold"
          >
            <Minus size={18} />
            Deploy
          </button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsTile 
          label="Total Liquidity" 
          value={summary.assets} 
          icon={<Wallet className="text-blue-500" size={24} />} 
          trend="+12.4%" 
          isPositive={true}
        />
        <StatsTile 
          label="Revenue Inflow" 
          value={summary.income} 
          icon={<TrendingUp className="text-emerald-500" size={24} />} 
          trend="+4.1%" 
          isPositive={true}
        />
        <StatsTile 
          label="Operating Burn" 
          value={summary.expenses} 
          icon={<Zap className="text-rose-500" size={24} />} 
          trend="-2.4%" 
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Performance Chart */}
        <div className="xl:col-span-8 bg-brand-surface p-8 rounded-3xl border border-brand-border flex flex-col min-w-0 shadow-sm">
           <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
                  <Activity size={18} className="text-brand-accent" />
                  Performance Matrix
                </h3>
                <p className="text-xs font-medium text-brand-secondary opacity-60">30-day capital flow distribution.</p>
              </div>
              <div className="flex gap-1 bg-brand-muted p-1 rounded-lg border border-brand-border/40">
                <button className="px-3 py-1 text-[10px] font-bold bg-brand-surface rounded-md shadow-sm border border-brand-border/40">Real-time</button>
                <button className="px-3 py-1 text-[10px] font-bold text-brand-secondary hover:text-brand-text">History</button>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={transactions.length > 0 ? transactions.slice(-15) : [{date: '', entries: [{amount: 0}]}]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    hide 
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid var(--color-border)', 
                      background: 'var(--color-surface)', 
                      fontSize: '12px',
                      fontWeight: '600',
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={(d) => d.entries?.[0]?.amount || 0} 
                    stroke="var(--color-accent)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    isAnimationActive={true}
                  />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-4 bg-brand-surface border border-brand-border p-8 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-brand-text">Recent Activity</h4>
            <button onClick={() => setView('transactions')} className="text-[10px] font-bold uppercase text-brand-accent tracking-wider hover:underline underline-offset-4">View All</button>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                <p className="text-sm font-medium italic">No recent activity</p>
              </div>
            ) : (
              recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-brand-muted/50 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border transition-transform duration-300 group-hover:scale-105 ${tx.entries[0]?.type === 'DEBIT' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                      {tx.entries[0]?.type === 'DEBIT' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-brand-text truncate w-32 lg:w-40">{tx.description}</p>
                      <p className="text-[10px] font-medium text-brand-secondary uppercase tracking-wider opacity-60">{tx.date}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-brand-text">₹{tx.entries[0]?.amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">AI Recommendation</p>
            <p className="text-xs text-brand-secondary font-medium leading-relaxed">
              System healthy. Consider increasing cash reserves for upcoming Q3 expansion.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsTile: React.FC<{ label: string; value: number; icon: React.ReactNode; trend: string; isPositive: boolean }> = ({ label, value, icon, trend, isPositive }) => (
  <div className="bg-brand-surface p-8 rounded-3xl border border-brand-border flex flex-col gap-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 rounded-xl bg-brand-muted flex items-center justify-center border border-brand-border shadow-sm group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary mb-1 opacity-60">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-brand-text tracking-tight tabular-nums">₹{value.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
