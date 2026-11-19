import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { chartColors, circularOptions, dateRangeChanges } from '../../utils/chart-utils';

@Component({
  selector: 'app-comments-chart',
  imports: [ChartModule, CardModule, FloatLabelModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './comments-chart.component.html',
  styleUrl: './comments-chart.component.css',
})
export class CommentsChartComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  today = new Date();

  data = signal<any>(null);
  empty = signal(false);

  options = circularOptions('Comentarios por usuario');

  formFilter: FormGroup;

  constructor(private formBuilder: FormBuilder, private statsService: StatsService) {
    this.formFilter = this.formBuilder.group({
      createdAtRange: [null],
    });
  }

  ngOnInit() {
    dateRangeChanges(this.formFilter.controls['createdAtRange'])
      .pipe(
        switchMap(({ minDate, maxDate }) =>
          this.statsService.commentsPerUser(minDate, maxDate).pipe(
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
              label: 'Cantidad de comentarios',
              data: response.map(x => x.commentsCount),
              backgroundColor: chartColors(response.length),
              borderColor: '#FFFBF2',
              borderWidth: 2,
            },
          ],
        });
      });
  }
}
