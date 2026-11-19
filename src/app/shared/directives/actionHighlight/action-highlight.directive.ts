import { computed, Directive, input, signal } from '@angular/core';

export type HighlightColor = 'red' | 'blue' | 'green' | 'gray';
export type HighlightShade = 300 | 400 | 500 | 600 | 800;

/**
 * Paleta propia (valores de la escala de Tailwind) para no depender de que Tailwind
 * genere las variables CSS `--color-*`, que solo emite las que detecta en uso.
 */
const PALETTE: Record<HighlightColor, Record<HighlightShade, string>> = {
  red: { 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 800: '#991b1b' },
  blue: { 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 800: '#1e40af' },
  green: { 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 800: '#166534' },
  gray: { 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 800: '#1f2937' },
};

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
  /** Color de la acción: red | blue | green | gray. */
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
