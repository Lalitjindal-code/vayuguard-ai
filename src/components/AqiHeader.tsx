import React, { useState } from 'react';
import {
  Wind,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Sun,
  Key,
  RefreshCw,
  MapPin,
  Search,
  Wrench,
  MessageSquare,
  Car,
  Languages,
} from 'lucide-react';
import { AirQualityTelemetry, AqiSeverity, Language } from '../types/airQuality';
import { CITY_PRESETS } from '../services/aqiService';
import { TRANSLATIONS } from '../utils/translations';

interface AqiHeaderProps {
  telemetry: AirQualityTelemetry;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onPresetSelect: (cityName: string) => void;
  onOpenKeyModal: () => void;
  onOpenPurifierModal: () => void;
  onOpenRwaModal: () => void;
  onOpenCommuteModal: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  isLoadingTelemetry: boolean;
  hasCustomKey: boolean;
}

export const AqiHeader: React.FC<AqiHeaderProps> = ({
  telemetry,
  selectedCity,
  onCityChange,
  onPresetSelect,
  onOpenKeyModal,
  onOpenPurifierModal,
  onOpenRwaModal,
  onOpenCommuteModal,
  language,
  onToggleLanguage,
  isLoadingTelemetry,
  hasCustomKey,
}) => {
  const [customSearch, setCustomSearch] = useState<string>('');
  const t = TRANSLATIONS[language];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearch.trim()) {
      onCityChange(customSearch.trim());
      setCustomSearch('');
    }
  };

  const getSeverityBadge = (severity: AqiSeverity) => {
    switch (severity) {
      case 'Severe':
        return {
          icon: <Flame className="w-5 h-5 text-red-400" aria-hidden="true" />,
          label: t.severeSmog,
          bgColor: 'bg-red-950/40 border-red-500/50 text-red-200',
          textColor: 'text-red-400',
        };
      case 'Poor':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" aria-hidden="true" />,
          label: t.poorAir,
          bgColor: 'bg-orange-950/40 border-orange-500/50 text-orange-200',
          textColor: 'text-orange-400',
        };
      case 'Moderate':
        return {
          icon: <Wind className="w-5 h-5 text-amber-400" aria-hidden="true" />,
          label: t.moderateAir,
          bgColor: 'bg-amber-950/40 border-amber-500/50 text-amber-200',
          textColor: 'text-amber-400',
        };
      case 'Good':
      default:
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />,
          label: t.goodAir,
          bgColor: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200',
          textColor: 'text-emerald-400',
        };
    }
  };

  const badge = getSeverityBadge(telemetry.severity);

  return (
    <header className="border-b border-subtle bg-surface/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top Bar: Brand, Tools, Language & Key */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Product Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Wind className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-100 font-sans">
                    {language === 'hi' ? 'वायुगार्ड' : 'VayuGuard'}{' '}
                    <span className="text-emerald-400">AI</span>
                  </h1>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CPCB NAQI (India)
                  </span>
                </div>
                <p className="text-xs text-slate-400">{t.tagline}</p>
              </div>
            </div>

            {/* Mobile Action Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-1 rounded-lg bg-elevated border border-subtle text-xs font-semibold text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Toggle language"
              >
                {language === 'en' ? 'हिंदी' : 'EN'}
              </button>
              <button
                type="button"
                onClick={onOpenKeyModal}
                className="p-1.5 rounded-lg bg-elevated border border-subtle text-slate-300 hover:text-emerald-400"
                aria-label="Manage Gemini Key"
              >
                <Key className={`w-4 h-4 ${hasCustomKey ? 'text-emerald-400' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>

          {/* Quick Action Tools Pills & Language Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tool 1: Purifier Calculator */}
            <button
              type="button"
              onClick={onOpenPurifierModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-elevated hover:bg-slate-800 border border-subtle text-xs font-medium text-cyan-300 hover:border-cyan-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.purifierToolBtn}</span>
            </button>

            {/* Tool 2: RWA Action Kit */}
            <button
              type="button"
              onClick={onOpenRwaModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-elevated hover:bg-slate-800 border border-subtle text-xs font-medium text-emerald-300 hover:border-emerald-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.rwaNoticeToolBtn}</span>
            </button>

            {/* Tool 3: Commute Compare */}
            <button
              type="button"
              onClick={onOpenCommuteModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-elevated hover:bg-slate-800 border border-subtle text-xs font-medium text-amber-300 hover:border-amber-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Car className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.commuteToolBtn}</span>
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated border border-subtle text-xs font-semibold text-slate-200 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Desktop BYOK Key Button */}
            <button
              type="button"
              onClick={onOpenKeyModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated border border-subtle text-xs font-medium text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={hasCustomKey ? 'Gemini API Key Active' : 'Set Gemini API Key'}
            >
              <Key className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{hasCustomKey ? 'Key Active' : 'API Key (BYOK)'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & City Preset Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          {/* Custom City Live Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 flex-1 max-w-md">
            <div className="relative flex-1">
              <label htmlFor="custom-city-search" className="sr-only">
                {t.searchCityPlaceholder}
              </label>
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <input
                id="custom-city-search"
                type="text"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                placeholder={t.searchCityPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-elevated border border-subtle rounded-lg text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 rounded-lg hover:bg-emerald-300 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {t.searchBtn}
            </button>
          </form>

          {/* City Selection & Quick Demo Presets */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5" role="toolbar" aria-label="Demo AQI presets">
            <div className="relative min-w-[130px]">
              <label htmlFor="city-select" className="sr-only">
                {t.selectCity}
              </label>
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-3 h-3" aria-hidden="true" />
              </div>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full pl-7 pr-6 py-1.5 text-xs font-medium bg-elevated border border-subtle rounded-lg text-slate-100 hover:border-slate-500 focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Noida">Noida</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Indore">Indore</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Patna">Patna</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>

            {CITY_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onPresetSelect(preset.name)}
                className={`px-2 py-1 text-xs rounded-md border transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 whitespace-nowrap ${
                  selectedCity.toLowerCase().includes(preset.name.toLowerCase())
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                    : 'bg-elevated/70 border-subtle text-slate-400 hover:text-slate-200'
                }`}
                aria-pressed={selectedCity.toLowerCase().includes(preset.name.toLowerCase())}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <section
          aria-label="Current Air Quality Telemetry"
          className="pt-2 border-t border-subtle/60 flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Multi-modal AQI Severity Indicator (CPCB NAQI) */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${badge.bgColor}`}
              role="status"
              aria-label={`Air Quality: ${badge.label}, CPCB NAQI ${telemetry.aqi}`}
            >
              {badge.icon}
              <span className="font-semibold">{badge.label}</span>
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black/40">
                CPCB {telemetry.aqi}
              </span>
            </div>

            {/* PM2.5, PM10 & Dominant Pollutant */}
            <div className="flex items-center gap-3 text-slate-300 font-mono">
              <span title="Fine Inhalable Particulate Matter (under 2.5 micrometers)">
                PM<sub>2.5</sub>:{' '}
                <strong className={`font-semibold ${badge.textColor}`}>
                  {telemetry.pm25} µg/m³
                </strong>
              </span>
              <span className="text-slate-600" aria-hidden="true">|</span>
              <span title="Coarse Inhalable Particulate Matter (under 10 micrometers)">
                PM<sub>10</sub>: <strong className="font-semibold text-slate-200">{telemetry.pm10} µg/m³</strong>
              </span>
              <span className="text-slate-600" aria-hidden="true">|</span>
              <span className="text-cyan-300 text-[11px] font-sans">
                Dominant: <strong>{telemetry.dominantPollutant || 'PM2.5'}</strong>
              </span>
              <span className="text-slate-600" aria-hidden="true">|</span>
              <span className="text-slate-400 text-[11px] font-sans">
                {telemetry.isSimulated ? '(CPCB Indian Standard)' : '(CPCB Live Calc)'}
              </span>
            </div>
          </div>

          {/* Diurnal Thermal Inversion & Safe Ventilation Window */}
          <div className="flex items-center gap-2 text-slate-300">
            <Sun className="w-4 h-4 text-cyan-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-slate-400">{t.safeVentWindow}</span>
            <span className="font-medium text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 px-2 py-0.5 rounded font-mono">
              {telemetry.safeVentilationWindow}
            </span>
            {isLoadingTelemetry && (
              <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin ml-1" aria-label="Updating telemetry..." />
            )}
          </div>
        </section>
      </div>
    </header>
  );
};
