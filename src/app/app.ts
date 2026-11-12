import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationCancellationCode, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('NestSocial');

  /**
   * true mientras se resuelve la primera navegación. Los guards consultan al backend si hay una
   * sesión válida (me / refresh-token) y el router no termina hasta que responden.
   */
  protected readonly checkingSession = signal(true);

  constructor() {
    inject(Router).events.pipe(
      filter(event =>
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        // Una redirección (ej. guard que manda a /auth/login) cancela y arranca otra navegación: se sigue esperando.
        (event instanceof NavigationCancel &&
          event.code !== NavigationCancellationCode.Redirect &&
          event.code !== NavigationCancellationCode.SupersededByNewNavigation)
      ),
      takeUntilDestroyed(),
    ).subscribe(() => this.checkingSession.set(false));
  }
}
