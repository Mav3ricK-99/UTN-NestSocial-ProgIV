import { AbstractControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs';

/** Rango de fechas expresado en segundos UNIX (lo que espera la API). Vacío = sin filtro. */
export interface DateRangeSeconds {
  minDate?: number;
  maxDate?: number;
}

export const CHART_PALETTE = [
  '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EF5350',
  '#26C6DA', '#FFEE58', '#8D6E63', '#EC407A', '#7E57C2',
];

/** Devuelve `count` colores, repitiendo la paleta si hace falta. */
export function chartColors(count: number, alpha = 1): string[] {
  return Array.from({ length: count }, (_, i) => withAlpha(CHART_PALETTE[i % CHART_PALETTE.length], alpha));
}

function withAlpha(hex: string, alpha: number): string {
  if (alpha >= 1) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Convierte el valor del p-datepicker (selectionMode="range") en un rango para la API.
 *  - null / '' / [] / [null, null]  -> {} (sin filtro)
 *  - [inicio, null]                 -> null (selección incompleta: se ignora)
 *  - [inicio, fin]                  -> desde 00:00:00 de `inicio` hasta 23:59:59 de `fin` (hora local)
 */
export function toDateRange(value: unknown): DateRangeSeconds | null {
  if (!Array.isArray(value)) return {};

  const [start, end] = value;
  if (!start && !end) return {};
  if (!(start instanceof Date) || !(end instanceof Date)) return null;

  const from = new Date(start);
  from.setHours(0, 0, 0, 0);

  const to = new Date(end);
  to.setHours(23, 59, 59, 0);

  return {
    minDate: Math.floor(from.getTime() / 1000),
    maxDate: Math.floor(to.getTime() / 1000),
  };
}

/**
 * Emite el rango de fechas cada vez que cambia de verdad el filtro (y una vez al inicio, sin filtro).
 * Ignora selecciones incompletas y repeticiones del mismo rango.
 */
export function dateRangeChanges(control: AbstractControl): Observable<DateRangeSeconds> {
  return control.valueChanges.pipe(
    map(toDateRange),
    filter((range): range is DateRangeSeconds => range !== null),
    debounceTime(300),
    startWith<DateRangeSeconds>({}),
    distinctUntilChanged((a, b) => a.minDate === b.minDate && a.maxDate === b.maxDate),
  );
}

/** Quita el HTML (los posts se guardan con Quill) y recorta el texto. */
export function plainText(html: string | null | undefined, maxLength = 40): string {
  const text = (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '(sin texto)';
  return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
}

const pad = (n: number) => String(n).padStart(2, '0');

export interface DayCount { year: number; month: number; day: number; count: number; }

/**
 * Completa con 0 los días sin datos para que el eje X sea continuo.
 * Si se pasa un rango se usa como límite; si no, va del primer al último día con datos.
 */
export function fillMissingDays(rows: DayCount[], range: DateRangeSeconds = {}): { labels: string[]; values: number[] } {
  if (!rows.length && !(range.minDate && range.maxDate)) return { labels: [], values: [] };

  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const counts = new Map(rows.map(r => [`${r.year}-${r.month - 1}-${r.day}`, r.count]));

  const first = rows.length ? new Date(rows[0].year, rows[0].month - 1, rows[0].day) : null;
  const last = rows.length ? new Date(rows[rows.length - 1].year, rows[rows.length - 1].month - 1, rows[rows.length - 1].day) : null;

  const start = range.minDate ? new Date(range.minDate * 1000) : first!;
  const end = range.maxDate ? new Date(range.maxDate * 1000) : last!;

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const limit = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const labels: string[] = [];
  const values: number[] = [];
  const MAX_DAYS = 400;

  while (cursor <= limit && labels.length < MAX_DAYS) {
    labels.push(`${pad(cursor.getDate())}/${pad(cursor.getMonth() + 1)}/${cursor.getFullYear()}`);
    values.push(counts.get(key(cursor)) ?? 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  return { labels, values };
}

const baseTick = { precision: 0 };

/** Opciones para barras / líneas (ejes cartesianos). */
export function cartesianOptions(title: string, opts: { horizontal?: boolean } = {}): any {
  const valueAxis = { beginAtZero: true, ticks: baseTick };

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: opts.horizontal ? 'y' : 'x',
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
    },
    scales: opts.horizontal
      ? { x: valueAxis, y: { ticks: { autoSkip: false } } }
      : { y: valueAxis },
  };
}

/** Opciones para pie / doughnut / polarArea (sin ejes cartesianos). */
export function circularOptions(title: string): any {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      title: { display: true, text: title },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const values = (ctx.dataset.data as number[]).map(Number);
            const total = values.reduce((a, b) => a + b, 0);
            const value = Number(ctx.raw);
            const pct = total ? ((value / total) * 100).toFixed(1) : '0';
            return `${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };
}
