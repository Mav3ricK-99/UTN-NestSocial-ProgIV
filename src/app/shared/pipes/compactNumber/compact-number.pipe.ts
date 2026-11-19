import { Pipe, PipeTransform } from '@angular/core';

const UNITS = [
  { limit: 1_000_000_000, suffix: 'B' },
  { limit: 1_000_000, suffix: 'M' },
  { limit: 1_000, suffix: 'K' },
];

/**
 * Abrevia numeros grandes: 950 -> "950", 1250 -> "1,2K", 3400000 -> "3,4M".
 * Trunca (no redondea) para no mostrar "1000K" cuando el valor es 999.999.
 */
@Pipe({
  name: 'compactNumber',
  standalone: true,
})
export class CompactNumberPipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    const num = Number(value ?? 0);

    if (!Number.isFinite(num)) {
      return '0';
    }

    const abs = Math.abs(num);
    const unit = UNITS.find(u => abs >= u.limit);

    if (!unit) {
      return String(Math.trunc(num));
    }

    const scaled = Math.floor((abs / unit.limit) * 10) / 10;
    const text = String(scaled).replace('.', ',');

    return `${num < 0 ? '-' : ''}${text}${unit.suffix}`;
  }

}
