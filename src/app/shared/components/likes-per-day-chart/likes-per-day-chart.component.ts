import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { cartesianOptions, dateRangeChanges, fillMissingDays } from '../../utils/chart-utils';

@Component({
  selector: 'app-likes-per-day-chart',
  imports: [ChartModule, CardModule, FloatLabelModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './likes-per-day-chart.component.html',
  styleUrl: './likes-per-day-chart.component.css',
})
export class LikesPerDayChartComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  today = new Date();

  data = signal<any>(null);
  empty = signal(false);

  options = cartesianOptions('Me gusta por día');

  formFilter: FormGroup;

  constructor(private formBuilder: FormBuilder, private statsService: StatsService) {
    this.formFilter = this.formBuilder.group({
      createdAtRange: [null],
    });
  }

  ngOnInit() {
    dateRangeChanges(this.formFilter.controls['createdAtRange'])
      .pipe(
        switchMap(range =>
          this.statsService.likesPerDay(range.minDate, range.maxDate).pipe(
            map((response: any[]) => ({ response, range })),
            catchError(err => {
              console.error(err);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ response, range }) => {
        // Los días sin likes no vienen de la API: se completan con 0 para no distorsionar la línea.
        const { labels, values } = fillMissingDays(
          response.map(x => ({ year: x._id.year, month: x._id.month, day: x._id.day, count: x.likes })),
          range,
        );

        this.empty.set(response.length === 0);
        this.data.set({
          labels,
          datasets: [
            {
              label: 'Cantidad de me gusta',
              data: values,
              fill: true,
              tension: 0.35,
              borderColor: '#EF5350',
              backgroundColor: 'rgba(239, 83, 80, 0.18)',
              pointBackgroundColor: '#EF5350',
              pointRadius: values.length > 60 ? 0 : 3,
              borderWidth: 2,
            },
          ],
        });
      });
  }
}
