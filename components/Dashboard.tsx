
import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { AccountType } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard: React.FC = () => {
  const { accounts, transactions, setView, setFormIntent } = useApp();
  const t = TRANSLATIONS;

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

  const recentTransactions = transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return (
    <div className="p-8 lg:p-16 space-y-16 animate-slide-up max-w-[1600px] mx-auto w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <h2 className="text-6xl font-black tracking-tighter text-brand-text leading-tight">
              Wealth <span className="text-brand-accent">OS</span>
            </h2>
            <div className="px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[11px] font-black uppercase tracking-[0.2em] rounded-full">
              Intelligence Node
            </div>
          </div>
          <p className="text-brand-secondary font-semibold text-lg opacity-80 max-w-xl leading-snug">
            Real-time liquidity monitoring and capital allocation overview.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => handleQuickAction('INCOME')}
            className="group px-10 py-5 bg-brand-surface text-brand-text border border-brand-border rounded-[2rem] shadow-sm hover:border-brand-accent hover:text-brand-accent transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
          >
            Deposit Capital
          </button>
          
          <button 
            onClick={() => handleQuickAction('EXPENSE')}
            className="group px-10 py-5 bg-brand-primary text-white rounded-[2rem] shadow-2xl shadow-brand-primary/20 hover:scale-[1.05] active:scale-95 transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
          >
            Deploy Funds
          </button>
        </div>
      </header>

      {/* Main Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatsTile label="Total Liquidity" value={summary.assets} color="blue" icon="💳" trend="+12.4%" />
        <StatsTile label="Revenue Inflow" value={summary.income} color="emerald" icon="📈" trend="+4.1%" />
        <StatsTile label="Operating Burn" value={summary.expenses} color="rose" icon="📉" trend="-2.4%" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Performance Visualization */}
        <div className="xl:col-span-8 bg-brand-surface p-12 lg:p-14 rounded-[4rem] border border-brand-border bento-card flex flex-col min-w-0">
           <div className="flex justify-between items-end mb-14 shrink-0">
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tight text-brand-text">Performance Matrix</h3>
                <p className="text-sm font-bold text-brand-secondary opacity-60">Visualizing 30-day capital flow distribution.</p>
              </div>
              <div className="flex gap-2 bg-brand-muted/40 p-2 rounded-2xl border border-brand-border/40">
                <button className="px-6 py-2 text-[11px] font-black bg-brand-surface rounded-xl shadow-sm border border-brand-border/40">Real-time</button>
                <button className="px-6 py-2 text-[11px] font-black text-brand-secondary hover:text-brand-text">History</button>
              </div>
           </div>
           
           <div className="flex-1 w-full min-h-[400px]">
             <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={transactions.length > 0 ? transactions.slice(-15) : [{date: '', entries: [{amount: 0}]}]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '2rem', 
                      border: '1px solid var(--color-border)', 
                      background: 'var(--color-surface)', 
                      color: 'var(--color-text)',
                      padding: '16px 20px',
                      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.1)'
                    }}
                    cursor={{ stroke: 'var(--color-accent)', strokeWidth: 2, strokeDasharray: '6 6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={(d) => d.entries?.[0]?.amount || 0} 
                    stroke="var(--color-accent)" 
                    strokeWidth={6} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    isAnimationActive={true}
                    animationDuration={2000}
                  />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Intelligence & Log */}
        <div className="xl:col-span-4 flex flex-col gap-10">
           <div className="bg-brand-primary p-12 rounded-[4rem] text-white flex flex-col justify-between bento-card h-[420px] shadow-3xl shadow-brand-primary/30 group border-none">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-all duration-700 border border-white/10">🤖</div>
                <div>
                  <h4 className="text-4xl font-black leading-[1.1] mb-5 tracking-tighter">Strategic<br/>Wealth Advisor</h4>
                  <p className="text-base opacity-70 font-semibold leading-relaxed">System healthy. Allocation suggests increasing cash reserves for Q3 expansion.</p>
                </div>
              </div>
              <button 
                onClick={() => setView('banking')}
                className="w-full bg-white text-brand-primary font-black py-5 rounded-[2rem] hover:bg-brand-accent hover:text-white transition-all text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-black/10"
              >
                Analyze Ledger
              </button>
           </div>

           <div className="bg-brand-surface border border-brand-border p-12 rounded-[4rem] bento-card flex-1 min-h-[450px]">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-2xl font-black tracking-tight text-brand-text">Capital Logs</h4>
                <button onClick={() => setView('transactions')} className="text-[11px] font-black uppercase text-brand-accent tracking-widest hover:underline decoration-2 underline-offset-4">Browse All</button>
              </div>
              
              <div className="space-y-7">
                {recentTransactions.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <p className="text-lg font-black italic">Awaiting data...</p>
                  </div>
                ) : (
                  recentTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-brand-muted/40 p-2 rounded-2xl transition-all">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-brand-border/60 transition-transform duration-500 group-hover:scale-110 ${tx.entries[0]?.type === 'DEBIT' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {tx.entries[0]?.type === 'DEBIT' ? '↓' : '↑'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-[15px] text-brand-text truncate w-32 md:w-48">{tx.description}</p>
                          <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.15em] opacity-50">{tx.date}</p>
                        </div>
                      </div>
                      <span className="font-mono font-black text-sm text-brand-text">₹{tx.entries[0]?.amount.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatsTile: React.FC<{ label: string; value: number; color: string; icon: string; trend: string }> = ({ label, value, color, icon, trend }) => (
  <div className="bg-brand-surface p-12 rounded-[4rem] border border-brand-border bento-card flex flex-col gap-10 relative overflow-hidden group">
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-brand-muted to-transparent rounded-full opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-700" />
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-brand-border/60 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${color === 'emerald' ? 'bg-emerald-50' : color === 'rose' ? 'bg-rose-50' : 'bg-blue-50'}`}>
        {icon}
      </div>
      <div className={`px-4 py-2 rounded-full text-[11px] font-black tracking-widest border ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
        {trend}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[12px] font-black uppercase tracking-[0.25em] text-brand-secondary mb-3 opacity-60 leading-none">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-brand-text tracking-tighter tabular-nums">₹{value.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
