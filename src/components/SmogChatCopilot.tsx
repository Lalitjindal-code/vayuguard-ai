import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am your **VayuGuard Smog Copilot**, grounded in your live ${telemetry.city} air quality (AQI ${telemetry.aqi} ${telemetry.severity}) and family profile. Ask me any follow-up questions on school commutes, DIY filter builds, or community action!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'Is it safe for my 4-year-old to play outside at 4 PM today?',
    'How do I make a ₹800 DIY air purifier for a 12x12 bedroom?',
    'Draft a WhatsApp message for our RWA to stop morning leaf burning.',
  ];

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
    <aside
      aria-labelledby="copilot-heading"
      className="bg-surface border border-subtle rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Accordion Toggle Header */}
      <div className="p-4 flex items-center justify-between border-b border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 id="copilot-heading" className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Context-Aware Smog Copilot
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 font-normal">
                Grounded in {telemetry.city} AQI
              </span>
            </h2>
            <p className="text-xs text-slate-400">Instant answers for winter exposure & society actions</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-elevated border border-subtle text-slate-300 hover:text-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse Smog Copilot Chat' : 'Expand Smog Copilot Chat'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Quick Starter Chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Suggested questions">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-elevated border border-subtle text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors text-left focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 inline mr-1 text-emerald-400" aria-hidden="true" />
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            role="log"
            aria-live="polite"
            className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                    <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-tr-none'
                      : 'bg-elevated text-slate-200 border border-subtle rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] text-slate-500 mt-1 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                    <User className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" aria-hidden="true" />
                <span>Smog Copilot is formulating evidence-based guidance...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmitForm} className="flex items-center gap-2 pt-2 border-t border-subtle">
            <label htmlFor="copilot-query-input" className="sr-only">
              Ask Smog Copilot
            </label>
            <input
              id="copilot-query-input"
              type="text"
              placeholder="Ask about outdoor safety, DIY filters, school timings..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              maxLength={300}
              className="flex-1 px-3 py-2 text-xs bg-elevated border border-subtle rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
