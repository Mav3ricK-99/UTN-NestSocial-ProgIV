import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { cartesianOptions, chartColors, dateRangeChanges, plainText } from '../../utils/chart-utils';

/** Cantidad máxima de publicaciones a mostrar (las más comentadas). */
const TOP_POSTS = 10;

@Component({
  selector: 'app-comments-per-post-chart',
  imports: [ChartModule, CardModule, FloatLabelModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './comments-per-post-chart.component.html',
  styleUrl: './comments-per-post-chart.component.css',
})
export class CommentsPerPostChartComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  today = new Date();

  data = signal<any>(null);
  empty = signal(false);

  options = this.buildOptions();

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
          this.statsService.commentsPerPost(minDate, maxDate).pipe(
            catchError(err => {
              console.error(err);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response: any[]) => {
        const top = response.slice(0, TOP_POSTS);

        this.empty.set(top.length === 0);
        this.data.set({
          // El contenido del post es HTML (Quill): se muestra solo el texto, recortado.
          labels: top.map(x => plainText(x.content)),
          fullTexts: top.map(x => plainText(x.content, 200)),
          datasets: [
            {
              label: 'Cantidad de comentarios',
              data: top.map(x => x.commentsCount),
              backgroundColor: chartColors(top.length, 0.85),
              borderColor: chartColors(top.length),
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        });
      });
  }

  private buildOptions() {
    const options = cartesianOptions(`Comentarios por publicación (top ${TOP_POSTS})`, { horizontal: true });

    // El tooltip muestra el texto completo de la publicación.
    options.plugins.tooltip = {
      callbacks: {
        title: (items: any[]) => this.data()?.fullTexts?.[items[0].dataIndex] ?? items[0].label,
      },
    };

    return options;
  }
}
