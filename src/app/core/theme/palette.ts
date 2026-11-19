/**
 * Paleta de NestSocial ("Bosque otoñal").
 *
 *  - primary   -> verde bosque (reemplaza al azul). Marca: 600.
 *  - secondary -> terracota   (reemplaza al rojo).  Marca: 600.
 *  - cream     -> crema, fondos y superficies.
 *  - surface   -> neutros cálidos (escala `stone` de Tailwind), reemplaza a slate/gray.
 *
 * `primary` y `surface` se inyectan en PrimeNG (ver nest-preset.ts) y quedan disponibles en Tailwind
 * gracias a tailwindcss-primeui (bg-primary-600, text-surface-700, ...).
 * `secondary` y `cream` se declaran también en src/styles.css (@theme static): si cambias un valor
 * acá, cambialo allá.
 */
export type Scale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>;

export const PRIMARY: Scale = {
  50: '#F1F7F3',
  100: '#DCE9E0',
  200: '#B9D3C4',
  300: '#8DB7A0',
  400: '#5C957A',
  500: '#3F7A5E',
  600: '#2F6B4F',
  700: '#24543E',
  800: '#1B3F2F',
  900: '#132C21',
  950: '#0A1812',
};

export const SECONDARY: Scale = {
  50: '#FDF5EF',
  100: '#F3DCCB',
  200: '#E8BC9C',
  300: '#DB9A6E',
  400: '#CC7640',
  500: '#C0622B',
  600: '#B4531F',
  700: '#8F4018',
  800: '#6E3114',
  900: '#4D230E',
  950: '#2A1207',
};

/** Neutros cálidos: escala `stone` de Tailwind. */
export const SURFACE: Scale & { 0: string } = {
  0: '#FFFBF2',
  50: '#FAFAF9',
  100: '#F5F5F4',
  200: '#E7E5E4',
  300: '#D6D3D1',
  400: '#A8A29E',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917',
  950: '#0C0A09',
};

export const CREAM = {
  50: '#FFFBF2',
  100: '#F7F1E3',
  200: '#EDE4CE',
  300: '#DFD2B4',
  400: '#CDBB92',
  500: '#B5A073',
  600: '#8F7C52',
  700: '#6E5F3D',
} as const;

/** Colores semánticos que se mantienen fuera de la marca (likes, errores, acciones destructivas). */
export const DANGER: Partial<Scale> = {
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  800: '#991B1B',
};
