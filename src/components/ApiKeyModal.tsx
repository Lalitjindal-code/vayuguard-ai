import React, { useState, useEffect, useRef } from 'react';
import { Key, Shield, CheckCircle, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { ModalShell } from './ModalShell';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync draft input whenever the modal opens or external key changes
  useEffect(() => {
    if (isOpen) {
      setInputKey(currentKey);
      setShowKey(false);
    }
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen, currentKey]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    setShowSavedFeedback(true);
    closeTimerRef.current = setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
  };

  const isLikelyValidFormat = !inputKey.trim() || inputKey.trim().startsWith('AIza');

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId="api-key-modal-title"
      title="Gemini API Key (BYOK)"
      subtitle="Optional session-only configuration"
      icon={<Key className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />}
      iconWrapperClassName="bg-emerald-500/10 border-2 border-emerald-400 text-emerald-400"
      closeAriaLabel="Close dialog"
      maxWidthClassName="max-w-md"
    >
      <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gemini-key-input" className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 font-mono">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                id="gemini-key-input"
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2 text-xs font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-400 brutal-shadow-sm"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {!isLikelyValidFormat && (
              <p className="text-[11px] text-amber-400 font-mono mt-1">
                Note: Standard Google Gemini API keys typically start with "AIzaSy..."
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-[#111824] border-2 border-slate-800 space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-mono font-bold">ZERO STORAGE EXPOSURE:</strong> Keys are held strictly in browser memory for this session and are never logged or stored in localStorage.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Don't have a key? The app automatically runs our built-in <strong>deterministic context engine</strong> with full mathematical precision.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold"
            >
              Get free Gemini API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-bold font-mono uppercase text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear Key
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold font-mono uppercase text-slate-300 bg-slate-900 border-2 border-slate-700 rounded-lg hover:bg-slate-800 brutal-shadow-sm brutal-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black font-mono uppercase text-slate-950 bg-emerald-400 border-2 border-emerald-500 rounded-lg hover:bg-emerald-300 brutal-shadow-emerald brutal-btn"
              >
                {showSavedFeedback ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    SAVED!
                  </>
                ) : (
                  'SAVE KEY'
                )}
              </button>
            </div>
          </div>
        </form>
    </ModalShell>
  );
};
