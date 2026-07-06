import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../../core/services/Stats/stats.service';
import { map } from 'rxjs';
import { CardModule } from 'primeng/card';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-likes-per-day-chart',
  imports: [ChartModule, CardModule, FloatLabelModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './likes-per-day-chart.component.html',
  styleUrl: './likes-per-day-chart.component.css',
})
export class LikesPerDayChartComponent implements OnInit {

  today: Date;

  public data: any;
  public options: any;

  formFilter: FormGroup;

  constructor(private formBuilder: FormBuilder, private statsService: StatsService) {
    this.formFilter = this.formBuilder.group({
      createdAtRange: [''],
    });

    this.options = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true,
          position: 'top'
        },

        title: {
          display: true,
          text: 'Likes en el dia'
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        }
      }
    };

    this.today = new Date();
  }

  ngOnInit() {
    this.getLikesPerDay();

    this.formFilter.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => this.formFilter.valid),
      )
      .subscribe(filterValues => {
        if (Array.isArray(filterValues.createdAtRange) && filterValues.createdAtRange.filter((date: any) => date == null).length == 1) return;

        const minDate = filterValues.createdAtRange[0].getTime() / 1000;
        const maxDate = (filterValues.createdAtRange[1].getTime() + 86400) / 1000;
        this.getLikesPerDay(minDate, maxDate);
      });
  }

  getLikesPerDay(minDate?: number, maxDate?: number) {
    this.statsService.likesPerDay(minDate, maxDate).pipe(
      map((response: any) => ({
        labels: response.map((x: any) => `${x._id.day}/${x._id.month}/${x._id.year}`),
        datasets: [
          {
            label: 'Cantidad de me gusta',
            data: response.map((x: any) => x.likes),
            backgroundColor: [
              '#42A5F5',
              '#66BB6A',
              '#FFA726',
              '#AB47BC',
              '#EF5350'
            ],
            borderColor: [
              '#1E88E5',
              '#43A047',
              '#FB8C00',
              '#8E24AA',
              '#E53935'
            ],
            borderWidth: 1
          }
        ]
      }))
    ).subscribe({
      next: (chartData) => {
        this.data = chartData;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
