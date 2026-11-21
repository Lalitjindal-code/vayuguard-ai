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

interface ProfileFormProps {
  profile: HouseholdProfile;
  onChange: (updated: HouseholdProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

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
          <h2 id="profile-heading" className="text-base font-extrabold uppercase tracking-wide text-white font-sans">
            Household Context Profiler
          </h2>
          <p className="text-xs text-slate-400 font-mono">Tailors routines & hacks to your lifestyle</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Housing Type */}
        <div>
          <label htmlFor="housing-select" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 font-mono">
            <Home className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            Housing Type & Location
          </label>
          <select
            id="housing-select"
            value={profile.housing}
            onChange={(e) => onChange({ ...profile, housing: e.target.value as HousingType })}
            className="w-full px-3 py-2 text-xs font-bold font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white hover:border-slate-500 focus:border-emerald-400 brutal-shadow-sm cursor-pointer appearance-none"
          >
            <option value="apartment">High-Rise Apartment (Ventilation elevation)</option>
            <option value="independent_house">Ground Floor / Independent Villa</option>
            <option value="roadside_home">Roadside / High-Traffic Corridor</option>
          </select>
        </div>

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

        {/* Commute Mode */}
        <div>
          <label htmlFor="commute-select" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 font-mono">
            <Car className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            Primary Daily Commute Mode
          </label>
          <select
            id="commute-select"
            value={profile.commute}
            onChange={(e) => onChange({ ...profile, commute: e.target.value as CommuteMode })}
            className="w-full px-3 py-2 text-xs font-bold font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white hover:border-slate-500 focus:border-emerald-400 brutal-shadow-sm cursor-pointer appearance-none"
          >
            <option value="solo_car">Solo Car (Petrol / Diesel / CNG)</option>
            <option value="two_wheeler">Motorcycle / Scooter (High roadside exposure)</option>
            <option value="public_transit">Metro / City Bus Transit</option>
            <option value="ev_or_wfh">Electric Vehicle / Bicycle / WFH</option>
          </select>
        </div>

        {/* Cooking & Heating Fuel */}
        <div>
          <label htmlFor="fuel-select" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 font-mono">
            <Flame className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
            Indoor Cooking & Winter Heating
          </label>
          <select
            id="fuel-select"
            value={profile.cookingFuel}
            onChange={(e) => onChange({ ...profile, cookingFuel: e.target.value as CookingFuel })}
            className="w-full px-3 py-2 text-xs font-bold font-mono bg-slate-900 border-2 border-slate-700 rounded-lg text-white hover:border-slate-500 focus:border-emerald-400 brutal-shadow-sm cursor-pointer appearance-none"
          >
            <option value="lpg_with_chimney">LPG / PNG Gas with Active Chimney</option>
            <option value="lpg_no_exhaust">LPG Gas without Duct Exhaust</option>
            <option value="electric_induction">Induction / Microwave / Clean Electric</option>
            <option value="biomass_coal">Space Coil Heater / Biomass / Wood Fire</option>
          </select>
        </div>

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
          className="w-full py-3 px-4 rounded-xl font-extrabold uppercase font-mono text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 border-2 border-emerald-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all brutal-shadow-emerald brutal-btn flex items-center justify-center gap-2"
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
