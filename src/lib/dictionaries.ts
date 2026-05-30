import 'server-only';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  sw: () => import('../dictionaries/sw.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'sw') => {
  if (!dictionaries[locale]) {
    return dictionaries['en']();
  }
  return dictionaries[locale]();
};

export type Dictionary = typeof import('../dictionaries/en.json');
