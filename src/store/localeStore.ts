import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'ne';

interface LocaleState {
  locale: Locale;
  useDevanagariNumerals: boolean;
  setLocale: (locale: Locale) => void;
  toggleDevanagariNumerals: () => void;
}

// Convert Arabic numerals to Devanagari
export const toDevanagariNumerals = (num: number | string): string => {
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num).replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit)]);
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      useDevanagariNumerals: false,
      setLocale: (locale) => set({ locale }),
      toggleDevanagariNumerals: () =>
        set((state) => ({ useDevanagariNumerals: !state.useDevanagariNumerals })),
    }),
    { name: 'edunexus-locale' }
  )
);
