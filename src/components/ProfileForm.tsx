import React from 'react';
import {
  Users,
  Home,
  ShieldAlert,
  Car,
  Flame,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  HouseholdProfile,
  HousingType,
  CommuteMode,
  CookingFuel,
  VulnerabilityGroup,
} from '../types/airQuality';
import { NeoSelect } from './NeoSelect';

interface ProfileFormProps {
  profile: HouseholdProfile;
  onChange: (updated: HouseholdProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const HOUSING_OPTIONS = [
  {
    value: 'apartment',
    label: 'High-Rise Apartment (Ventilation elevation)',
    subtext: 'Upper floor air exchange; wind draft exposure',
  },
  {
    value: 'independent_house',
    label: 'Ground Floor / Independent Villa',
    subtext: 'High ground-level particulate settling & humidity',
  },
  {
    value: 'roadside_home',
    label: 'Roadside / High-Traffic Corridor',
    subtext: 'Direct diesel exhaust, tyre dust & heavy metals',
  },
];

const COMMUTE_OPTIONS = [
  {
    value: 'solo_car',
    label: 'Solo Car (Petrol / Diesel / CNG)',
    subtext: 'High vehicular emissions; moderate cabin exposure',
  },
  {
    value: 'two_wheeler',
    label: 'Motorcycle / Scooter (High roadside exposure)',
    subtext: 'Extreme roadside inhalable particulate exposure',
  },
  {
    value: 'public_transit',
    label: 'Metro / City Bus Transit',
    subtext: 'Lowest carbon footprint; walk portions need N95',
  },
  {
    value: 'ev_or_wfh',
    label: 'Electric Vehicle / Bicycle / WFH',
    subtext: 'Zero tailpipe emissions; minimal road exposure',
  },
];

const FUEL_OPTIONS = [
  {
    value: 'lpg_with_chimney',
    label: 'LPG / PNG Gas with Active Chimney',
    subtext: 'Active mechanical extraction of combustion NO2',
  },
  {
    value: 'lpg_no_exhaust',
    label: 'LPG Gas without Duct Exhaust',
    subtext: 'Trapped indoor nitrogen dioxide and moisture',
  },
  {
    value: 'electric_induction',
    label: 'Induction / Microwave / Clean Electric',
    subtext: 'Zero indoor combustion gases or open flame',
  },
  {
    value: 'biomass_coal',
    label: 'Space Coil Heater / Biomass / Wood Fire',
    subtext: 'Severe indoor carbon monoxide & soot hazard',
  },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleVulnerabilityToggle = (vuln: VulnerabilityGroup) => {
    const exists = profile.vulnerabilities.includes(vuln);
    let updated: VulnerabilityGroup[];

    if (vuln === 'none') {
      updated = ['none'];
    } else {
      const filtered = profile.vulnerabilities.filter((v) => v !== 'none');
      if (exists) {
        updated = filtered.filter((v) => v !== vuln);
        if (updated.length === 0) updated = ['none'];
      } else {
        updated = [...filtered, vuln];
      }
    }

    onChange({ ...profile, vulnerabilities: updated });
  };

  return (
    <section
      aria-labelledby="profile-heading"
      className="bg-[#0C121B] border-2 border-slate-700 rounded-xl p-5 brutal-shadow space-y-5"
    >
      <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-mono font-bold">
          <Users className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </div>
        <div>
          <h2 id="profile-heading" className="text-base font-black uppercase tracking-wide text-white font-display">
            Household Context Profiler
          </h2>
          <p className="text-xs text-slate-400 font-mono">Tailors routines & hacks to your lifestyle</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Housing Type (Custom Neo-Brutalist Select) */}
        <NeoSelect
          id="housing-select"
          label="Housing Type & Location"
          value={profile.housing}
          onChange={(val) => onChange({ ...profile, housing: val as HousingType })}
          options={HOUSING_OPTIONS}
          icon={<Home className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />}
        />

        {/* Vulnerable Groups */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 mb-2 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            High-Risk Vulnerabilities (Multi-Select)
          </label>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Household health sensitivities">
            {[
              { id: 'children', label: 'Infants / Toddlers' },
              { id: 'elderly', label: 'Elderly (60+ yrs)' },
              { id: 'respiratory_condition', label: 'Asthma / Bronchitis' },
              { id: 'none', label: 'Healthy Adults' },
            ].map((v) => {
              const isSelected = profile.vulnerabilities.includes(v.id as VulnerabilityGroup);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVulnerabilityToggle(v.id as VulnerabilityGroup)}
                  className={`px-2.5 py-2 text-xs rounded-lg border-2 text-left font-bold font-mono transition-all brutal-btn ${
                    isSelected
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 brutal-shadow-emerald'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white brutal-shadow-sm'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="mr-1.5">{isSelected ? '✓' : '+'}</span>
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Commute Mode (Custom Neo-Brutalist Select) */}
        <NeoSelect
          id="commute-select"
          label="Primary Daily Commute Mode"
          value={profile.commute}
          onChange={(val) => onChange({ ...profile, commute: val as CommuteMode })}
          options={COMMUTE_OPTIONS}
          icon={<Car className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />}
        />

        {/* Cooking & Heating Fuel (Custom Neo-Brutalist Select) */}
        <NeoSelect
          id="fuel-select"
          label="Indoor Cooking & Winter Heating"
          value={profile.cookingFuel}
          onChange={(val) => onChange({ ...profile, cookingFuel: val as CookingFuel })}
          options={FUEL_OPTIONS}
          icon={<Flame className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />}
        />

        {/* Specific Notes (Sanitized) */}
        <div>
          <label htmlFor="custom-notes" className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 font-mono">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              Specific Household Context
            </span>
            <span className="text-[10px] text-slate-500">MAX 200</span>
          </label>
          <input
            id="custom-notes"
            type="text"
            maxLength={200}
            placeholder="e.g. 4-year-old goes to school at 7:30 AM, nearby construction"
            value={profile.customNotes}
            onChange={(e) => onChange({ ...profile, customNotes: e.target.value })}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-400 brutal-shadow-sm"
          />
        </div>

        {/* Submit / Generate Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-black uppercase font-display tracking-wider text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 border-2 border-emerald-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all brutal-shadow-emerald brutal-btn flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" aria-hidden="true" />
              <span>Analyzing Smog & Tailoring Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>Generate Personalized Plan</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};
