import { Pipe, PipeTransform } from '@angular/core';

/**
 * Recorta un texto a `limit` caracteres y agrega `suffix` si fue recortado.
 * Con `stripHtml = true` elimina primero las etiquetas HTML (util para
 * contenido que viene del editor de texto enriquecido).
 *
 * Uso: {{ texto | truncate:120 }}  |  {{ html | truncate:10:'...':true }}
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {

  transform(
    value: string | null | undefined,
    limit: number = 100,
    suffix: string = '…',
    stripHtml: boolean = false
  ): string {
    if (!value) {
      return '';
    }

    let text = stripHtml ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : value;

    if (text.length <= limit) {
      return text;
    }

    return text.slice(0, limit).trimEnd() + suffix;
  }

}
