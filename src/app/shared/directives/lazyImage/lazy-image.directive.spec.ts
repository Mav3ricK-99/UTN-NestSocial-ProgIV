import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LazyImageDirective } from './lazy-image.directive';

@Component({
  imports: [LazyImageDirective],
  template: `<img [appLazyImage]="src()" fallbackSrc="/fallback.png" alt="x" />`,
})
class HostComponent {
  src = signal<string | undefined>('/real.png');
}

describe('LazyImageDirective', () => {
  let trigger: (intersecting: boolean) => void;

  beforeEach(() => {
    class FakeObserver {
      constructor(private cb: (entries: any[]) => void) {
        trigger = (isIntersecting) => this.cb([{ isIntersecting }]);
      }
      observe() {}
      disconnect() {}
    }
    (globalThis as any).IntersectionObserver = FakeObserver;
  });

  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    return { fixture, img: fixture.nativeElement.querySelector('img') as HTMLImageElement };
  }

  it('no asigna src hasta que la imagen entra en pantalla', async () => {
    const { fixture, img } = await setup();
    expect(img.getAttribute('src')).toBeNull();

    trigger(false);
    await fixture.whenStable();
    expect(img.getAttribute('src')).toBeNull();

    trigger(true);
    await fixture.whenStable();
    expect(img.getAttribute('src')).toBe('/real.png');
  });

  it('hace fade-in al cargar', async () => {
    const { fixture, img } = await setup();
    trigger(true);
    await fixture.whenStable();
    expect(img.style.opacity).toBe('0');

    img.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(img.style.opacity).toBe('1');
  });

  it('usa el fallback si la imagen falla o no hay URL', async () => {
    const { fixture, img } = await setup();
    trigger(true);
    await fixture.whenStable();

    img.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(img.getAttribute('src')).toBe('/fallback.png');

    fixture.componentInstance.src.set(undefined);
    await fixture.whenStable();
    expect(img.getAttribute('src')).toBe('/fallback.png');
  });
});
