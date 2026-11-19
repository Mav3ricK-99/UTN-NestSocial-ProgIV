import { computed, Directive, input, signal } from '@angular/core';
import { DANGER, PRIMARY, SECONDARY, SURFACE } from '../../../core/theme/palette';

export type HighlightColor = 'red' | 'primary' | 'secondary' | 'gray';
export type HighlightShade = 300 | 400 | 500 | 600 | 800;

/**
 * Paleta propia (core/theme/palette.ts) para no depender de que Tailwind genere las variables
 * CSS `--color-*`, que solo emite las que detecta en uso.
 *  - primary / secondary: colores de marca (verde bosque / terracota).
 *  - red: semántico (likes, eliminar). gray: neutros cálidos.
 */
const PALETTE: Record<HighlightColor, Record<HighlightShade, string>> = {
  red: pick(DANGER),
  primary: pick(PRIMARY),
  secondary: pick(SECONDARY),
  gray: pick(SURFACE),
};

function pick(scale: Partial<Record<number, string>>): Record<HighlightShade, string> {
  return { 300: scale[300]!, 400: scale[400]!, 500: scale[500]!, 600: scale[600]!, 800: scale[800]! };
}

/**
 * Directiva de atributo que "resalta" el color de un botón (y de su ícono, que hereda `currentColor`).
 *
 * El elemento se muestra con el tono `base` (suave) y pasa al tono `highlight` (intenso) cuando:
 *  - el mouse está encima, o el elemento tiene el foco del teclado, o
 *  - el input `active` es true (por ejemplo, un post con like).
 *
 * Ejemplo:
 *   <button appActionHighlight="red" [active]="post().getLiked()">...</button>
 *   <button appActionHighlight="gray" [base]="500" [highlight]="800">...</button>
 */
@Directive({
  selector: '[appActionHighlight]',
  host: {
    '[style.color]': 'currentColor()',
    '[style.transition]': '"color 300ms ease-in-out"',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
    '(focus)': 'hovered.set(true)',
    '(blur)': 'hovered.set(false)',
  },
})
export class ActionHighlightDirective {
  /** Color de la acción: red | primary | secondary | gray. */
  readonly appActionHighlight = input.required<HighlightColor>();

  /** Fuerza el estado resaltado (ej.: like dado). */
  readonly active = input<boolean>(false);

  /** Tono usado en reposo. */
  readonly base = input<HighlightShade>(300);

  /** Tono usado al resaltar (hover, foco o `active`). */
  readonly highlight = input<HighlightShade>(500);

  protected readonly hovered = signal(false);

  protected readonly currentColor = computed(() => {
    const shades = PALETTE[this.appActionHighlight()];
    const shade = this.hovered() || this.active() ? this.highlight() : this.base();
    return shades[shade];
  });
}
