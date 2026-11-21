import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, ShieldAlert, Users, Car } from 'lucide-react';
import { AirQualityTelemetry, Language } from '../types/airQuality';

interface RwaActionKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: AirQualityTelemetry;
  language: Language;
}

export const RwaActionKitModal: React.FC<RwaActionKitModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'guards' | 'carpool'>('whatsapp');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const notices = {
    whatsapp: {
      title: 'WhatsApp Society Notice',
      icon: <Users className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      text:
        language === 'hi'
          ? `📢 *सोसाइटी महत्वपूर्ण सूचना: शीतकालीन स्मॉग एवं स्वास्थ्य सुरक्षा*

आदरणीय निवासियों,
हमारे शहर ${telemetry.city} में आज वायु गुणवत्ता सूचकांक (CPCB AQI) *${telemetry.aqi}* (${telemetry.severity === 'Severe' ? 'गंभीर' : telemetry.severity}) पर पहुंच गया है।

ठंड और विंटर इन्वर्जन (Thermal Inversion) के कारण जमीन का धुआं ऊपर नहीं जा पा रहा है।

🛑 *आवश्यक नियम एवं दिशा-निर्देश:*
1. सूखे पत्तों, प्लास्टिक या कचरे को खुले में जलाना पूर्णतः प्रतिबंधित है।
2. सफाई कर्मचारी सूखी झाड़ू के बजाय गीला पोछा (Damp Mopping) लगाएं ताकि धूल न उड़े।
3. बच्चे एवं वरिष्ठ नागरिक सुबह 10 बजे से पहले बाहर टहलने से बचें।

कृपया पर्यावरण और अपने बच्चों के फेफड़ों की सुरक्षा में सहयोग करें! 🌿
— *RWA प्रबंध समिति*`
          : `📢 *URGENT RWA NOTICE: Severe Winter Smog & Health Protection*

Dear Residents,
The Air Quality Index (CPCB AQI) in ${telemetry.city} has reached *${telemetry.aqi} (${telemetry.severity})* today.

Due to winter thermal inversion, dense ground-level smoke and toxic PM2.5 are trapped below breathing height.

🛑 *Mandatory Society Directives:*
1. *Zero Open Burning:* Strict prohibition on burning dry garden leaves, garbage, or plastics.
2. *Wet Dust Suppression:* Housekeeping must strictly use wet microfiber mopping instead of dry broom sweeping to avoid aerosolizing settled PM10.
3. *Vulnerable Timing:* Children and elderly residents should avoid outdoor jogging/play before 10:30 AM and after 6:30 PM.

Let us protect our children's and seniors' respiratory health! 🌿
— *RWA Management Committee*`,
    },
    guards: {
      title: 'Security & Staff Directive',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" aria-hidden="true" />,
      text:
        language === 'hi'
          ? `📋 *सुरक्षा गार्ड एवं हाउसकीपिंग स्टाफ हेतु विशेष निर्देश*

1. रात की ड्यूटी में ठंड से बचने के लिए लकड़ी, पत्ते, या प्लास्टिक की अलाव (बोर्नफायर) बिल्कुल न जलाएं।
2. RWA द्वारा प्रदान किए गए ऑयल-रेडिएटर हीटर या कंबल का ही उपयोग करें।
3. सुबह 6:00 से 9:00 बजे के बीच सड़कों या बालकनियों पर सूखी झाड़ू न लगाएं; केवल पानी छिड़क कर गीला पोछा करें।
4. कॉलोनी में किसी को भी बगीचे का कचरा जलाते हुए देखने पर तुरंत RWA कार्यालय को सूचित करें।`
          : `📋 *DIRECTIVE FOR NIGHT SECURITY & HOUSEKEEPING STAFF*

1. *No Open Bonfires:* Under no circumstances should night security burn wood, dried leaves, or waste for warmth. Use the society-provided electric/oil heaters and blankets.
2. *Wet Mopping Protocol:* Clean common corridors and gates strictly by sprinkling water and wet damp-mopping. Dry sweeping creates choking dust clouds.
3. *Composting Enforcement:* Report any burning of dry plant waste immediately to the management office.`,
    },
    carpool: {
      title: 'Society Carpool Registry',
      icon: <Car className="w-4 h-4 text-cyan-400" aria-hidden="true" />,
      text:
        language === 'hi'
          ? `🚗 *सोसाइटी स्कूल एवं ऑफिस कारपूल पहल*

पड़ोसियों,
स्कूल के गेट और मुख्य मार्गों पर वाहनों के जाम से बच्चों के फेफड़ों में 5 गुना अधिक जहरीला धुआं जाता है।

आइए हम अपनी सोसाइटी के विंग्स के अनुसार कारपूल बनाएं:
• *रूट 1:* स्कूल वैन / कारपूल (सुबह 7:30 AM)
• *रूट 2:* मेट्रो स्टेशन फीडर कारपूल
• *रूट 3:* मुख्य आईटी पार्क / कमर्शियल हब

शामिल होने के लिए अपना विंग, फ्लैट नंबर और समय ग्रुप में साझा करें! 🌿`
          : `🚗 *COMMUNITY SCHOOL & OFFICE CARPOOL INITIATIVE*

Dear Neighbors,
Traffic congestion outside school gates and society exits during morning inversion hours exposes our children to 5x higher toxic diesel emissions.

Join our Community Carpooling Registry:
• *Cluster A:* School Drops (DPS / Ryan / Cambridge) — 7:30 AM
• *Cluster B:* Metro Station Shared Shuttle Connections
• *Cluster C:* Commercial / IT Hub Commute Clusters

Please reply with your Block/Flat number and daily route to match with nearby families! 🌿`,
    },
  };

  const currentNotice = notices[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentNotice.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rwa-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-[#0C121B] border-2 border-slate-700 rounded-xl brutal-shadow p-6 relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Close RWA Kit"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 brutal-shadow-sm font-bold">
            <MessageSquare className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <h2 id="rwa-modal-title" className="text-base font-black uppercase tracking-wide text-white font-display">
              Shareable RWA & Community Action Kit
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              One-click notices grounded in live {telemetry.city} CPCB AQI ({telemetry.aqi})
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-800">
          {[
            { id: 'whatsapp', label: 'WhatsApp Notice' },
            { id: 'guards', label: 'Staff Directive' },
            { id: 'carpool', label: 'Carpool Template' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'whatsapp' | 'guards' | 'carpool')}
              className={`px-3 py-1.5 text-xs font-bold font-mono uppercase rounded-lg border-2 transition-all brutal-btn ${
                activeTab === tab.id
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 brutal-shadow-emerald'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notice Preview Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border-2 border-slate-700 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto brutal-shadow-sm">
          {currentNotice.text}
        </div>

        {/* Copy Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Ready to paste in WhatsApp</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black font-mono uppercase text-slate-950 bg-emerald-400 border-2 border-emerald-500 hover:bg-emerald-300 brutal-shadow-emerald brutal-btn"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : 'COPY NOTICE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
