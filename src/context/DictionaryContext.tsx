"use client";

import React, { createContext, useContext } from 'react';
import type { Dictionary } from '../lib/dictionaries';

type DictionaryContextType = {
  dict: Dictionary;
  lang: 'en' | 'sw';
};

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({ 
  children, 
  dict,
  lang 
}: { 
  children: React.ReactNode; 
  dict: Dictionary;
  lang: 'en' | 'sw';
}) {
  return (
    <DictionaryContext.Provider value={{ dict, lang }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
