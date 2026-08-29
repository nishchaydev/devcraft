import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'DevCraft PWA',
    subtitle: 'Offline-First Order Management',
    intakeTab: 'Intake',
    ordersTab: 'Orders',
    conflictsTab: 'Conflicts',
    analyticsTab: 'Analytics',
    evalTab: 'Test A',
    online: 'ONLINE',
    airplaneMode: 'AIRPLANE MODE',
    geminiEngine: 'Gemini 1.5 Flash',
    localEngine: 'Local Fast-NLP',
    parseBtn: 'Parse Order Message',
    confirmSave: 'Confirm & Save to Offline DB',
    newOrder: 'New Order',
    searchPlaceholder: 'Search customer, order ID, or item...',
    whatsappReply: 'Send WhatsApp Reply',
    aiBreakdown: 'View AI Breakdown',
    all: 'All',
    dueToday: 'Due Today',
    unpaid: 'Unpaid',
    conflicted: 'Conflicted',
    clarification: 'Needs Clarification'
  },
  hi: {
    appTitle: 'देवक्राफ्ट ऐप',
    subtitle: 'ऑफलाइन ऑर्डर मैनेजमेंट',
    intakeTab: 'नया ऑर्डर',
    ordersTab: 'ऑर्डर लिस्ट',
    conflictsTab: 'विवाद (Sync)',
    analyticsTab: 'एनालिटिक्स',
    evalTab: 'टेस्ट ए',
    online: 'ऑनलाइन',
    airplaneMode: 'ऑफलाइन मोड',
    geminiEngine: 'जेमिनी 1.5 फ्लैश',
    localEngine: 'लोकल NLP इंजन',
    parseBtn: 'ऑर्डर मैसेज पार्स करें',
    confirmSave: 'ऑर्डर सेव करें (IndexedDB)',
    newOrder: '+ नया ऑर्डर',
    searchPlaceholder: 'ग्राहक, ऑर्डर आईडी या सामान खोजें...',
    whatsappReply: 'व्हाट्सएप रिप्लाई भेजें',
    aiBreakdown: 'AI विश्लेषण देखें',
    all: 'सभी',
    dueToday: 'आज के ऑर्डर',
    unpaid: 'उधार / बकाया',
    conflicted: 'Sync विवाद',
    clarification: 'स्पष्टीकरण चाहिए'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string): string => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
