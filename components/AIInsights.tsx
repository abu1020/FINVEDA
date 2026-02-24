import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';
import { getFinancialInsights } from '../services/geminiService';
import { Sparkles, X, Send, Bot, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AIInsights: React.FC = () => {
  const { transactions, accounts, language } = useApp();
  const t = TRANSLATIONS[language];
  
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchInsights = async (userQuery?: string) => {
    setIsLoading(true);
    const result = await getFinancialInsights(transactions, accounts, language, userQuery);
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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 max-h-[500px] bg-brand-surface rounded-2xl shadow-2xl border border-brand-border overflow-hidden flex flex-col glass-card"
          >
            <div className="p-4 bg-brand-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-brand-accent">
                  <Bot size={18} />
                </div>
                <div>
                  <span className="font-bold text-sm tracking-tight block leading-none">Wealth AI</span>
                  <span className="text-[9px] font-medium uppercase tracking-wider opacity-60">Insights Hub</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-1.5 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="p-6 h-80 overflow-y-auto bg-brand-muted/10 scroll-smooth space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">Analyzing ledger...</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-brand-surface p-4 rounded-xl rounded-tl-none border border-brand-border shadow-sm text-sm font-medium leading-relaxed text-brand-text whitespace-pre-wrap">
                    {insight || "Hello. How can I help you optimize your financial strategy today?"}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-brand-border/60 bg-brand-surface">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-brand-muted rounded-xl px-4 py-2 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-brand-accent/20 text-brand-text placeholder:text-brand-secondary/40 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !query}
                  className="bg-brand-primary text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 ${isOpen ? 'bg-rose-500 shadow-rose-500/20' : 'bg-brand-primary shadow-brand-primary/20'}`}
      >
        {isOpen ? <ChevronDown size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
};

export default AIInsights;
