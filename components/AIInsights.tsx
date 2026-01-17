
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { getFinancialInsights } from '../services/geminiService';

const AIInsights: React.FC = () => {
  const { transactions, accounts } = useApp();
  const t = TRANSLATIONS;
  
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchInsights = async (userQuery?: string) => {
    setIsLoading(true);
    const result = await getFinancialInsights(transactions, accounts, userQuery);
    setInsight(result || '');
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && transactions.length > 0 && !insight) {
      fetchInsights();
    }
  }, [isOpen, transactions.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [insight, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    fetchInsights(query);
    setQuery('');
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-8 w-96 max-h-[600px] bg-brand-surface rounded-[3rem] shadow-5xl border border-brand-border overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-700 ease-out glass-card premium-shadow">
          <div className="p-8 bg-brand-primary text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-accent/20 to-transparent pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/10">✨</div>
              <div>
                <span className="font-black text-lg tracking-tight block leading-none">{t.aiInsights}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Intelligence Hub</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-2.5 rounded-full transition-all relative z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="p-8 h-96 overflow-y-auto bg-brand-muted/20 scroll-smooth space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-5">
                <div className="w-12 h-12 border-[6px] border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-secondary">{t.analyzing}</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-brand-surface p-6 rounded-[2.5rem] rounded-tl-none border border-brand-border shadow-sm text-[15px] font-semibold leading-relaxed text-brand-text whitespace-pre-wrap">
                  {insight || "Greetings. How may I assist in optimizing your financial performance today?"}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-brand-border/60 bg-brand-surface">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.askAI}
                className="flex-1 bg-brand-muted rounded-2xl px-6 py-4 text-sm font-bold border-none outline-none focus:ring-4 focus:ring-brand-primary/5 text-brand-text placeholder:text-brand-secondary/40 transition-all"
              />
              <button 
                type="submit"
                className="bg-brand-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/30 hover:scale-110 active:scale-90 transition-all shrink-0 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-white shadow-5xl transition-all duration-700 hover:scale-110 active:scale-90 ${isOpen ? 'bg-rose-500 rotate-90 shadow-rose-500/30' : 'bg-brand-primary shadow-brand-primary/40'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full border-2 border-brand-primary animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIInsights;
