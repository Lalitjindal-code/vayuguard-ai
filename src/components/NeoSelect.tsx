import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface NeoSelectOption {
  value: string;
  label: string;
  subtext?: string;
}

interface NeoSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: NeoSelectOption[];
  icon?: React.ReactNode;
}

export const NeoSelect: React.FC<NeoSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 font-mono"
      >
        {icon}
        {label}
      </label>

      {/* Accessible native select for screen readers and unit test queries (getByLabelText) */}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Neo-Brutalist Trigger Button */}
      <div className="relative">
        <button
          type="button"
          id={`${id}-trigger`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-popup`}
          aria-label={`Current: ${selectedOption?.label || value}. Click to change.`}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold font-mono bg-[#0A0F18] border-2 rounded-lg text-white transition-all brutal-btn text-left ${
            isOpen
              ? 'border-emerald-400 brutal-shadow-emerald ring-1 ring-emerald-400/50'
              : 'border-slate-700 hover:border-slate-500 brutal-shadow-sm'
          }`}
        >
          <span className="truncate pr-2">{selectedOption?.label || value}</span>
          <div className="flex items-center pl-2 pointer-events-none text-emerald-400 flex-shrink-0">
            <ChevronDown
              className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-emerald-300' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Custom Neo-Brutalist Option Tray Popover */}
        {isOpen && (
          <div
            id={`${id}-popup`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="absolute left-0 right-0 z-50 mt-1.5 bg-[#0C121B] border-2 border-emerald-400 rounded-lg brutal-shadow-emerald overflow-hidden py-1 max-h-64 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-100 shadow-2xl"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2.5 text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-l-4 border-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex flex-col pr-2">
                    <span className="leading-tight">{opt.label}</span>
                    {opt.subtext && (
                      <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {opt.subtext}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
