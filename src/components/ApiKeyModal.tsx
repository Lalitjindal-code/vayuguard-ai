import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle, ExternalLink } from 'lucide-react';

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
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-surface border border-subtle rounded-2xl shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-elevated transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-lg font-bold text-slate-100">
              Gemini API Key (BYOK)
            </h2>
            <p className="text-xs text-slate-400">Optional session-only configuration</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gemini-key-input" className="block text-xs font-medium text-slate-300 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-elevated border border-subtle rounded-lg text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 font-mono transition-colors"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="p-3 rounded-lg bg-elevated/60 border border-subtle/80 space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Storage Exposure:</strong> Keys are held strictly in browser memory for this session and are never logged or persisted to localStorage.
              </span>
            </div>
            <p>
              Don't have a key? The app automatically runs our built-in <strong>deterministic context engine</strong> with full mathematical precision.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              Get a free Gemini API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs text-slate-400 hover:text-red-400 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 rounded-md"
            >
              Clear Key
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-elevated border border-subtle rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 shadow-md shadow-emerald-950"
              >
                {showSavedFeedback ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Saved!
                  </>
                ) : (
                  'Save Key'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
