import type { dictionary } from "@/locales/es";

const dictionaries = {
  en: () => import("@/locales/en").then((module) => module.dictionary),
  es: () => import("@/locales/es").then((module) => module.dictionary),
};

// We can use this to get the user's preferred locale.
// For now, we'll default to Spanish (es) for Argentina.
const getLocale = () => {
    // For now, let's default to 'es' 
    return 'es'; 
};

export const getDictionary = async () => {
  const locale = getLocale();
  const loader = dictionaries[locale as keyof typeof dictionaries] || dictionaries.es;
  return loader();
};

export type Dictionary = typeof dictionary;
