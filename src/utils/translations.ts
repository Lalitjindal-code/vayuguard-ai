/**
 * High-quality bilingual English & Hindi translations for VayuGuard AI.
 * Tailored for North Indian families, RWA coordinators, and community staff.
 */

import { Language } from '../types/airQuality';

export interface Translations {
  appTitle: string;
  tagline: string;
  selectCity: string;
  searchCityPlaceholder: string;
  searchBtn: string;
  keyModalTitle: string;
  safeVentWindow: string;
  severeSmog: string;
  poorAir: string;
  moderateAir: string;
  goodAir: string;
  householdProfiler: string;
  profilerSubtitle: string;
  housingType: string;
  vulnerabilities: string;
  primaryCommute: string;
  cookingFuel: string;
  customNotesLabel: string;
  generatePlanBtn: string;
  analyzingSmog: string;
  directImpactHeading: string;
  adoptedCountText: string;
  pm25Cut: string;
  carbonSaved: string;
  monthlySavings: string;
  communityMultiplierTitle: string;
  communityMultiplierDesc: string;
  treesEquiv: string;
  tabsAll: string;
  tabsRoutines: string;
  tabsHacks: string;
  tabsSwaps: string;
  copilotHeading: string;
  copilotSubtitle: string;
  purifierToolBtn: string;
  rwaNoticeToolBtn: string;
  commuteToolBtn: string;
  timelineHeading: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appTitle: 'VayuGuard AI',
    tagline: 'Urban Air Quality & Winter Smog Action Assistant',
    selectCity: 'Select City',
    searchCityPlaceholder: 'Search any city / town...',
    searchBtn: 'Search',
    keyModalTitle: 'Gemini API Key (BYOK)',
    safeVentWindow: 'Safe Ventilation Window:',
    severeSmog: 'Severe Smog',
    poorAir: 'Poor Quality',
    moderateAir: 'Moderate',
    goodAir: 'Good Air',
    householdProfiler: 'Household Context Profiler',
    profilerSubtitle: 'Tailors routines & hacks to your lifestyle',
    housingType: 'Housing Type & Location',
    vulnerabilities: 'High-Risk Vulnerabilities (Multi-Select)',
    primaryCommute: 'Primary Daily Commute Mode',
    cookingFuel: 'Indoor Cooking & Winter Heating',
    customNotesLabel: 'Specific Household Context (Optional)',
    generatePlanBtn: 'Generate Personalized Plan',
    analyzingSmog: 'Analyzing Smog & Tailoring Plan...',
    directImpactHeading: 'Quantified Direct Impact',
    adoptedCountText: 'recommendations adopted',
    pm25Cut: 'PM2.5 Exposure Cut',
    carbonSaved: 'Weekly Carbon Saved',
    monthlySavings: 'Monthly Savings',
    communityMultiplierTitle: 'Community Multiplier (100 Neighborhood Households)',
    communityMultiplierDesc: 'If 100 families in your society adopt this plan:',
    treesEquiv: 'Equivalent to planting trees',
    tabsAll: 'All Actions',
    tabsRoutines: 'Daily Routines',
    tabsHacks: 'Indoor Hacks',
    tabsSwaps: 'Sustainable Swaps',
    copilotHeading: 'Context-Aware Smog Copilot',
    copilotSubtitle: 'Instant answers for winter exposure & society actions',
    purifierToolBtn: 'DIY Purifier Calculator',
    rwaNoticeToolBtn: 'RWA Action Kit',
    commuteToolBtn: 'Commute Comparison',
    timelineHeading: '24-Hour Diurnal Smog & Inversion Timeline',
  },
  hi: {
    appTitle: 'वायुगार्ड AI',
    tagline: 'शहरी वायु गुणवत्ता एवं शीतकालीन स्मॉग निवारण सहायक',
    selectCity: 'शहर चुनें',
    searchCityPlaceholder: 'कोई भी शहर / कस्बा खोजें...',
    searchBtn: 'खोजें',
    keyModalTitle: 'जेमिनी API कुंजी (BYOK)',
    safeVentWindow: 'सुरक्षित वेंटिलेशन समय:',
    severeSmog: 'गंभीर स्मॉग',
    poorAir: 'खराब हवा',
    moderateAir: 'मध्यम',
    goodAir: 'स्वच्छ हवा',
    householdProfiler: 'पारिवारिक परिवेश प्रोफाइलर',
    profilerSubtitle: 'आपकी जीवनशैली के अनुसार दिनचर्या व घरेलू उपाय',
    housingType: 'आवास का प्रकार व स्थान',
    vulnerabilities: 'स्वास्थ्य संवेदनशीलता (बहु-चयन)',
    primaryCommute: 'दैनिक यात्रा का साधन',
    cookingFuel: 'रसोई ईंधन व हीटिंग व्यवस्था',
    customNotesLabel: 'परिवार से जुड़ा विशेष संदर्भ (वैकल्पिक)',
    generatePlanBtn: 'व्यक्तिगत कार्य-योजना बनाएं',
    analyzingSmog: 'स्मॉग विश्लेषण व योजना तैयार हो रही है...',
    directImpactHeading: 'प्रत्यक्ष स्वास्थ्य एवं पर्यावरण प्रभाव',
    adoptedCountText: 'सुझाव अपनाए गए',
    pm25Cut: 'PM2.5 सांस में कमी',
    carbonSaved: 'साप्ताहिक कार्बन बचत',
    monthlySavings: 'मासिक अनुमानित बचत',
    communityMultiplierTitle: 'सामुदायिक प्रभाव (100 पड़ोसी परिवार)',
    communityMultiplierDesc: 'यदि आपकी सोसाइटी के 100 परिवार इस योजना को अपनाते हैं:',
    treesEquiv: 'वृक्षारोपण के समतुल्य',
    tabsAll: 'सभी कार्य',
    tabsRoutines: 'दैनिक दिनचर्या',
    tabsHacks: 'घरेलू एयर हैक्स',
    tabsSwaps: 'टिकाऊ विकल्प',
    copilotHeading: 'स्मॉग कोपायलट (सहायक)',
    copilotSubtitle: 'शीतकालीन प्रदूषण व सोसाइटी से जुड़े प्रश्नों के सटीक उत्तर',
    purifierToolBtn: 'DIY प्यूरीफायर कैलकुलेटर',
    rwaNoticeToolBtn: 'RWA कम्युनिटी किट',
    commuteToolBtn: 'यात्रा माध्यम तुलना',
    timelineHeading: '24-घंटे का स्मॉग एवं इन्वर्जन चक्र',
  },
};
