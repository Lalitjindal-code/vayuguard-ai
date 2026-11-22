import React, { useState, useEffect, useRef } from 'react';
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
  Activity,
} from 'lucide-react';
import gsap from 'gsap';
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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const t = TRANSLATIONS[language];
  const headerRef = useRef<HTMLElement>(null);
  const aqiBadgeRef = useRef<HTMLDivElement>(null);

  // Dynamic header collapse on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP micro-animation on mount and telemetry update
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (aqiBadgeRef.current) {
      gsap.fromTo(
        aqiBadgeRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }, [telemetry.aqi]);

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
          icon: <Flame className="w-5 h-5 text-red-400 animate-pulse" aria-hidden="true" />,
          label: t.severeSmog,
          bgColor: 'bg-red-950/80 border-2 border-red-500 text-red-100 brutal-shadow-red',
          textColor: 'text-red-400',
          stripes: 'bg-hazard-stripes',
        };
      case 'Poor':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" aria-hidden="true" />,
          label: t.poorAir,
          bgColor: 'bg-orange-950/80 border-2 border-orange-500 text-orange-100 brutal-shadow-amber',
          textColor: 'text-orange-400',
          stripes: '',
        };
      case 'Moderate':
        return {
          icon: <Wind className="w-5 h-5 text-amber-400" aria-hidden="true" />,
          label: t.moderateAir,
          bgColor: 'bg-amber-950/80 border-2 border-amber-500 text-amber-100 brutal-shadow',
          textColor: 'text-amber-400',
          stripes: '',
        };
      case 'Good':
      default:
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />,
          label: t.goodAir,
          bgColor: 'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-100 brutal-shadow-emerald',
          textColor: 'text-emerald-400',
          stripes: 'bg-safe-stripes',
        };
    }
  };

  const badge = getSeverityBadge(telemetry.severity);

  return (
    <header
      ref={headerRef}
      className={`border-b-2 border-slate-700 bg-[#080D14]/95 backdrop-blur sticky top-0 z-40 brutal-shadow transition-all duration-200 ${
        isScrolled ? 'py-2' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scrolled Compact Header Bar */}
        {isScrolled ? (
          <div className="flex items-center justify-between gap-3">
            {/* Left: Brand + CPCB Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-mono font-bold">
                <Wind className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              </div>
              <span className="text-base font-black tracking-tight text-white font-display uppercase">
                {language === 'hi' ? 'वायुगार्ड' : 'VayuGuard'}
                <span className="text-emerald-400 ml-0.5">AI</span>
              </span>
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs ${badge.bgColor}`}
              >
                {badge.icon}
                <span className="font-extrabold uppercase font-sans text-[11px]">{badge.label}</span>
                <span className="font-mono text-[11px] font-black">CPCB {telemetry.aqi}</span>
              </div>
            </div>

            {/* Center: City & Safe Window */}
            <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedCity}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-cyan-400" />
                Safe Window: <strong>{telemetry.safeVentilationWindow}</strong>
              </span>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenPurifierModal}
                className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/60 text-xs font-bold text-cyan-300 hover:bg-cyan-950/40 brutal-btn"
                title={t.purifierToolBtn}
              >
                <Wrench className="w-3.5 h-3.5 inline mr-1" />
                <span className="hidden sm:inline">{t.purifierToolBtn}</span>
              </button>
              <button
                type="button"
                onClick={onOpenRwaModal}
                className="px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/60 text-xs font-bold text-emerald-300 hover:bg-emerald-950/40 brutal-btn"
                title={t.rwaNoticeToolBtn}
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                <span className="hidden sm:inline">{t.rwaNoticeToolBtn}</span>
              </button>
              <button
                type="button"
                onClick={onOpenCommuteModal}
                className="px-2.5 py-1 rounded bg-slate-900 border border-amber-500/60 text-xs font-bold text-amber-300 hover:bg-amber-950/40 brutal-btn"
                title={t.commuteToolBtn}
              >
                <Car className="w-3.5 h-3.5 inline mr-1" />
                <span className="hidden sm:inline">{t.commuteToolBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-xs font-bold text-slate-200 brutal-btn font-mono"
                aria-label="Switch Language"
              >
                {language === 'en' ? 'हिंदी' : 'EN'}
              </button>
              <button
                type="button"
                onClick={onOpenKeyModal}
                className="p-1 rounded bg-slate-900 border border-slate-600 text-slate-300 hover:text-emerald-400 brutal-btn"
                aria-label="Manage Gemini Key"
              >
                <Key className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>
        ) : (
          /* Full Command Deck View (Top of page / Initial load) */
          <div className="space-y-3">
            {/* Top Control Bar: Industrial Logo, Tool Buttons & Toggles */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Brand & Mission Statement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-mono font-bold">
                    <Wind className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display uppercase">
                        {language === 'hi' ? 'वायुगार्ड' : 'VayuGuard'}
                        <span className="text-emerald-400 ml-1">AI</span>
                      </h1>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 tracking-wider">
                        [CPCB NAQI//INDIA]
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      {t.tagline}
                    </p>
                  </div>
                </div>

                {/* Mobile Action Controls */}
                <div className="flex items-center gap-1.5 md:hidden">
                  <button
                    type="button"
                    onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
                    className="px-2.5 py-1 text-xs font-bold font-mono uppercase bg-slate-800 border-2 border-slate-600 rounded text-emerald-400 brutal-shadow-sm"
                    aria-label="Toggle language"
                  >
                    {language === 'en' ? 'हिंदी' : 'EN'}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenKeyModal}
                    className="p-1.5 rounded bg-slate-800 border-2 border-slate-600 text-slate-300 hover:text-emerald-400 brutal-shadow-sm"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-cyan-500/60 text-xs font-bold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 brutal-shadow-sm brutal-btn"
                >
                  <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.purifierToolBtn}</span>
                </button>

                {/* Tool 2: RWA Action Kit */}
                <button
                  type="button"
                  onClick={onOpenRwaModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-emerald-500/60 text-xs font-bold text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/40 brutal-shadow-sm brutal-btn"
                >
                  <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.rwaNoticeToolBtn}</span>
                </button>

                {/* Tool 3: Commute Compare */}
                <button
                  type="button"
                  onClick={onOpenCommuteModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-amber-500/60 text-xs font-bold text-amber-300 hover:border-amber-400 hover:bg-amber-950/40 brutal-shadow-sm brutal-btn"
                >
                  <Car className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.commuteToolBtn}</span>
                </button>

                {/* Language Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-slate-600 text-xs font-bold text-slate-200 hover:text-emerald-400 hover:border-emerald-400 brutal-shadow-sm brutal-btn"
                  aria-label="Switch Language"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
                </button>

                {/* Desktop BYOK Key Button */}
                <button
                  type="button"
                  onClick={onOpenKeyModal}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-slate-600 text-xs font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-400 brutal-shadow-sm brutal-btn"
                  aria-label={hasCustomKey ? 'Gemini API Key Active' : 'Set Gemini API Key'}
                >
                  <Key className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{hasCustomKey ? 'KEY ACTIVE' : 'API KEY'}</span>
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <input
                    id="custom-city-search"
                    type="text"
                    value={customSearch}
                    onChange={(e) => setCustomSearch(e.target.value)}
                    placeholder={t.searchCityPlaceholder}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 brutal-shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-extrabold uppercase font-mono bg-emerald-400 text-slate-950 border-2 border-emerald-500 rounded-lg hover:bg-emerald-300 brutal-shadow-sm brutal-btn"
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
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full pl-8 pr-6 py-1.5 text-xs font-bold font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-slate-100 hover:border-slate-500 focus:border-emerald-400 brutal-shadow-sm cursor-pointer appearance-none"
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
                    className={`px-2.5 py-1 text-xs font-bold font-mono rounded-lg border-2 transition-all brutal-btn whitespace-nowrap ${
                      selectedCity.toLowerCase().includes(preset.name.toLowerCase())
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 brutal-shadow-emerald'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 brutal-shadow-sm'
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
              className="pt-2 border-t-2 border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex flex-wrap items-center gap-3">
                {/* Multi-modal AQI Severity Indicator (CPCB NAQI) */}
                <div
                  ref={aqiBadgeRef}
                  className={`flex items-center gap-2 px-3.5 py-1 rounded-lg ${badge.bgColor} ${badge.stripes}`}
                  role="status"
                  aria-label={`Air Quality: ${badge.label}, CPCB NAQI ${telemetry.aqi}`}
                >
                  {badge.icon}
                  <span className="font-extrabold uppercase font-sans tracking-wide text-xs">
                    {badge.label}
                  </span>
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-black/60 border border-white/20">
                    CPCB {telemetry.aqi}
                  </span>
                </div>

                {/* PM2.5, PM10 & Dominant Pollutant */}
                <div className="flex items-center gap-3 text-slate-300 font-mono">
                  <span title="Fine Inhalable Particulate Matter (under 2.5 micrometers)">
                    PM<sub>2.5</sub>:{' '}
                    <strong className={`font-black ${badge.textColor}`}>
                      {telemetry.pm25} µg/m³
                    </strong>
                  </span>
                  <span className="text-slate-600" aria-hidden="true">|</span>
                  <span title="Coarse Inhalable Particulate Matter (under 10 micrometers)">
                    PM<sub>10</sub>: <strong className="font-bold text-slate-200">{telemetry.pm10} µg/m³</strong>
                  </span>
                  <span className="text-slate-600" aria-hidden="true">|</span>
                  <span className="text-cyan-300 text-[11px] font-mono">
                    DOMINANT: <strong>{telemetry.dominantPollutant || 'PM2.5'}</strong>
                  </span>
                  <span className="text-slate-600" aria-hidden="true">|</span>
                  <span className="text-slate-400 text-[10px] font-mono uppercase">
                    {telemetry.isSimulated ? '[STANDARD_CPCB]' : '[LIVE_CALC]'}
                  </span>
                </div>
              </div>

              {/* Diurnal Thermal Inversion & Safe Ventilation Window */}
              <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
                <Sun className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-spin-slow" aria-hidden="true" />
                <span className="text-slate-400 uppercase text-[11px] font-semibold">{t.safeVentWindow}</span>
                <span className="font-bold text-cyan-300 bg-cyan-950/60 border-2 border-cyan-500/50 px-2.5 py-0.5 rounded brutal-shadow-sm">
                  {telemetry.safeVentilationWindow}
                </span>
                {isLoadingTelemetry && (
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin ml-1" aria-label="Updating telemetry..." />
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </header>
  );
};
