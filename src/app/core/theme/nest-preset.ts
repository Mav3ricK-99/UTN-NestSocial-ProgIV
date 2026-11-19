import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { PRIMARY, SURFACE } from './palette';

/** Aura con la paleta de NestSocial: verde bosque como primario y neutros cálidos como superficies. */
export const NestPreset = definePreset(Aura, {
  semantic: {
    primary: PRIMARY,
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.100}',
          focusBackground: '{primary.200}',
          color: '{primary.800}',
          focusColor: '{primary.900}',
        },
        surface: SURFACE,
      },
    },
  },
});
