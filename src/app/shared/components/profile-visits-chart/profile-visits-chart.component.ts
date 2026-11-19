import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { EMPTY, catchError } from 'rxjs';
import { cartesianOptions, chartColors } from '../../utils/chart-utils';

@Component({
  selector: 'app-profile-visits-chart',
  imports: [ChartModule],
  templateUrl: './profile-visits-chart.component.html',
  styleUrl: './profile-visits-chart.component.css',
})
export class ProfileVisitsChartComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  data = signal<any>(null);
  empty = signal(false);

  options = cartesianOptions('Visitas a perfiles', { horizontal: true });

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.statsService.profileVisits().pipe(
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
            label: 'Cantidad de visitas',
            data: response.map(x => x.visitsCount),
            backgroundColor: chartColors(response.length, 0.85),
            borderColor: chartColors(response.length),
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      });
    });
  }
}
