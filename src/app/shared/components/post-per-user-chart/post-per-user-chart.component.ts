import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { cartesianOptions, chartColors, dateRangeChanges } from '../../utils/chart-utils';

@Component({
  selector: 'app-post-per-user-chart',
  imports: [ChartModule, CardModule, FloatLabelModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './post-per-user-chart.component.html',
  styleUrl: './post-per-user-chart.component.css',
})
export class PostPerUserChartComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  today = new Date();

  // Signals: la app es zoneless, asignar una propiedad común no refresca la vista.
  data = signal<any>(null);
  empty = signal(false);

  options = cartesianOptions('Publicaciones por usuario');

  formFilter: FormGroup;

  constructor(private formBuilder: FormBuilder, private statsService: StatsService) {
    this.formFilter = this.formBuilder.group({
      createdAtRange: [null],
    });
  }

  ngOnInit() {
    dateRangeChanges(this.formFilter.controls['createdAtRange'])
      .pipe(
        // switchMap cancela la consulta anterior: una respuesta vieja no pisa a la nueva.
        switchMap(({ minDate, maxDate }) =>
          this.statsService.postsPerUser(minDate, maxDate).pipe(
            catchError(err => {
              console.error(err);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response: any[]) => {
        this.empty.set(response.length === 0);
        this.data.set({
          labels: response.map(x => x.username),
          datasets: [
            {
              label: 'Cantidad de publicaciones',
              data: response.map(x => x.postsCount),
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
