export type Language = 'en' | 'am' | 'om' | 'ti';

export const translations = {
  en: {
    home: 'Home',
    topics: 'Topics',
    progress: 'Progress',
    profile: 'Profile',
    help: 'Help',
    welcome: 'Welcome back',
    continueLearning: 'Continue Learning',
    recentActivity: 'Recent Activity',
    logout: 'Log Out',
    language: 'Language',
    settings: 'Settings',
  },
  am: {
    home: 'ዋና ገጽ',
    topics: 'ርዕሶች',
    progress: 'እድገት',
    profile: 'መገለጫ',
    help: 'እርዳታ',
    welcome: 'እንኳን ደህና መጡ',
    continueLearning: 'መማር ይቀጥሉ',
    recentActivity: 'የቅርብ ጊዜ እንቅስቃሴ',
    logout: 'ውጣ',
    language: 'ቋንቋ',
    settings: 'ቅንብሮች',
  },
  om: {
    home: 'Man\'ee',
    topics: 'Mata-dureewwan',
    progress: 'Guddina',
    profile: 'Piroofayilii',
    help: 'Gargaarsa',
    welcome: 'Baga nagaan dhuftan',
    continueLearning: 'Barachuu itti fufaa',
    recentActivity: 'Sochii dhiheenyaa',
    logout: 'Ba\'i',
    language: 'Afaan',
    settings: 'Qindaa\'ina',
  },
  ti: {
    home: 'መራኸቢ',
    topics: 'አርእስታት',
    progress: 'ምዕባለ',
    profile: 'ፕሮፋይል',
    help: 'ሓገዝ',
    welcome: 'እንቋዕ ብደሓን መጻእኩም',
    continueLearning: 'ምምሃር ቀጽል',
    recentActivity: 'ናይ ቀረባ ንጥፈታት',
    logout: 'ውጣ',
    language: 'ቋንቋ',
    settings: 'ቅንብሮች',
  }
};

export function useTranslation(lang: Language) {
  return translations[lang] || translations['en'];
}
