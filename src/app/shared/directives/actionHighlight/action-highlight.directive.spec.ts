import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionHighlightDirective } from './action-highlight.directive';

@Component({
  imports: [ActionHighlightDirective],
  template: `<button appActionHighlight="red" [active]="active()">like</button>`,
})
class HostComponent {
  active = signal(false);
}

describe('ActionHighlightDirective', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    return { fixture, button: fixture.nativeElement.querySelector('button') as HTMLButtonElement };
  }

  it('usa el tono suave en reposo, el intenso en hover y vuelve al salir', async () => {
    const { fixture, button } = await setup();
    const rest = button.style.color;

    button.dispatchEvent(new Event('mouseenter'));
    await fixture.whenStable();
    const hover = button.style.color;
    expect(hover).not.toBe(rest);

    button.dispatchEvent(new Event('mouseleave'));
    await fixture.whenStable();
    expect(button.style.color).toBe(rest);
  });

  it('queda resaltado mientras active sea true', async () => {
    const { fixture, button } = await setup();
    const rest = button.style.color;

    fixture.componentInstance.active.set(true);
    await fixture.whenStable();
    expect(button.style.color).not.toBe(rest);
  });
});
