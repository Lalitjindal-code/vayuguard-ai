import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import {
  HouseholdProfile,
  AirQualityTelemetry,
  ChatMessage,
} from '../types/airQuality';
import { askSmogCopilot } from '../services/geminiService';

interface SmogChatCopilotProps {
  profile: HouseholdProfile;
  telemetry: AirQualityTelemetry;
  userApiKey?: string;
}

export const SmogChatCopilot: React.FC<SmogChatCopilotProps> = ({
  profile,
  telemetry,
  userApiKey,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am your **VayuGuard Smog Copilot**, grounded in live ${telemetry.city} air quality (CPCB AQI ${telemetry.aqi} ${telemetry.severity}) and your family profile. Ask any follow-up questions on safe outdoor hours, DIY filter builds, or community action!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'Is it safe for my 4-year-old to play outside at 4 PM today?',
    'How do I make a ₹800 DIY air purifier for a 12x12 bedroom?',
    'Draft a WhatsApp message for our RWA to stop morning leaf burning.',
    'Which mask grade is best for motorcycle commute in AQI 400+?',
  ];

  // Auto-scroll to bottom of messages (with jsdom safety guard)
  useEffect(() => {
    if (
      isOpen &&
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === 'function'
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await askSmogCopilot(q, profile, telemetry, userApiKey);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an error analyzing your question. Please ensure your query is safe and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <section
      aria-labelledby="copilot-heading"
      className="w-full bg-[#0C121B] border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden brutal-shadow"
    >
      {/* Header */}
      <div className="p-4 sm:px-6 flex items-center justify-between border-b-2 border-slate-800 bg-[#080D14]/90">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-mono font-bold">
            <MessageSquare className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 id="copilot-heading" className="text-sm sm:text-base font-black uppercase tracking-wide text-white font-display">
                Context-Aware Smog Copilot
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/60">
                [CPCB::{telemetry.city.toUpperCase()}]
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hidden sm:inline-flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                NEO-TERMINAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live generative advisor for real-time winter smog protection & community actions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-900 border-2 border-slate-700 text-slate-300 hover:text-white brutal-shadow-sm brutal-btn flex items-center gap-1.5 text-xs font-mono font-bold"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse Smog Copilot Chat' : 'Expand Smog Copilot Chat'}
        >
          <span className="hidden sm:inline">{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Quick Starter Chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Suggested questions">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
              Suggested:
            </span>
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 border-2 border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 transition-colors text-left font-mono font-semibold brutal-btn disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 inline mr-1.5 text-emerald-400" aria-hidden="true" />
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container (Roomy terminal grade) */}
          <div
            role="log"
            aria-live="polite"
            className="h-80 overflow-y-auto space-y-3.5 pr-2 text-xs sm:text-sm bg-[#080D14]/70 p-4 rounded-xl border-2 border-slate-800/80 font-mono"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-emerald-500/50 brutal-shadow-sm font-bold">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-xl max-w-[85%] sm:max-w-[75%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500/20 text-emerald-100 border-2 border-emerald-500/40 brutal-shadow-sm font-sans text-xs sm:text-sm'
                      : 'bg-[#0E1522] text-slate-200 border-2 border-slate-700 brutal-shadow-sm whitespace-pre-line font-sans text-xs sm:text-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] text-slate-500 mt-1.5 text-right font-mono font-bold">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-slate-700 brutal-shadow-sm font-bold">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" aria-hidden="true" />
                <span>Smog Copilot is formulating evidence-based guidance for {telemetry.city}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmitForm} className="flex items-center gap-2.5 pt-2 border-t-2 border-slate-800">
            <label htmlFor="copilot-query-input" className="sr-only">
              Ask Smog Copilot
            </label>
            <input
              id="copilot-query-input"
              type="text"
              placeholder="Ask about outdoor safety, morning school runs, DIY filter builds, RWA resolutions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              maxLength={300}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-400 brutal-shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-lg bg-emerald-400 text-slate-950 font-black font-display uppercase tracking-wider text-xs border-2 border-emerald-500 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed brutal-shadow-sm brutal-btn flex items-center gap-1.5"
              aria-label="Send message"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
