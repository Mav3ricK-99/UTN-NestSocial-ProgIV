import { afterNextRender, computed, DestroyRef, Directive, effect, ElementRef, inject, input, signal, untracked } from '@angular/core';

/**
 * Directiva para `<img>` que difiere la descarga de la imagen hasta que está por entrar en pantalla.
 *
 *  - Usa IntersectionObserver: el `src` real recién se asigna cuando la imagen se acerca al viewport
 *    (`rootMargin`, por defecto 200px antes). Si el navegador no lo soporta, carga de inmediato.
 *  - Hace un fade-in al terminar de cargar (opacidad 0 -> 1).
 *  - Si la imagen falla (o no hay URL) y se indicó `fallbackSrc`, muestra esa imagen en su lugar.
 *
 * Ejemplo:
 *   <img [appLazyImage]="user.getAvatarPathUrl()" fallbackSrc="/default-avatar.jfif" alt="avatar" />
 */
@Directive({
  selector: 'img[appLazyImage]',
  host: {
    '[attr.src]': 'currentSrc()',
    '[style.opacity]': 'loaded() ? 1 : 0',
    '[style.transition]': '"opacity 500ms ease-in-out"',
    '(load)': 'loaded.set(true)',
    '(error)': 'onError()',
  },
})
export class LazyImageDirective {
  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** URL real de la imagen. */
  readonly appLazyImage = input<string | null | undefined>();

  /** Imagen alternativa si la principal no existe o falla al cargar. */
  readonly fallbackSrc = input<string | undefined>();

  /** Margen alrededor del viewport a partir del cual se empieza a cargar. */
  readonly rootMargin = input<string>('200px');

  protected readonly visible = signal(false);
  protected readonly loaded = signal(false);
  private readonly failed = signal(false);

  protected readonly currentSrc = computed<string | null>(() => {
    if (!this.visible()) return null;
    const src = this.appLazyImage();
    if (src && !this.failed()) return src;
    return this.fallbackSrc() ?? null;
  });

  constructor() {
    // Si cambia la URL (el elemento se reutiliza), se reinicia el estado y vuelve a hacer fade-in.
    effect(() => {
      this.appLazyImage();
      untracked(() => {
        this.failed.set(false);
        this.loaded.set(false);
      });
    });

    // Solo corre en el navegador (en SSR no hay IntersectionObserver ni DOM real).
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.visible.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.visible.set(true);
            observer.disconnect();
          }
        },
        { rootMargin: this.rootMargin() },
      );

      observer.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected onError(): void {
    // Si ya estaba mostrando el fallback (o no hay), no se reintenta para evitar un bucle de errores.
    if (this.failed() || !this.fallbackSrc()) return;
    this.failed.set(true);
  }
}
