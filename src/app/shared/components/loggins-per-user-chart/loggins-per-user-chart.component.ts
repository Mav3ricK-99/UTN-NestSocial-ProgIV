import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { EMPTY, catchError } from 'rxjs';
import { chartColors, circularOptions } from '../../utils/chart-utils';

@Component({
  selector: 'app-loggins-per-user-chart',
  imports: [ChartModule],
  templateUrl: './loggins-per-user-chart.component.html',
  styleUrl: './loggins-per-user-chart.component.css',
})
export class LogginsPerUserChartComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  data = signal<any>(null);
  empty = signal(false);

  options = circularOptions('Ingresos por usuario');

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.statsService.loginsPerUser().pipe(
      catchError(err => {
        console.error(err);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((response: any[]) => {
      this.empty.set(response.length === 0);
      this.data.set({
        labels: response.map(x => x.username),
        datasets: [
          {
            label: 'Cantidad de ingresos',
            data: response.map(x => x.loginCount),
            backgroundColor: chartColors(response.length, 0.75),
            borderColor: chartColors(response.length),
            borderWidth: 1,
          },
        ],
      });
    });
  }
}
