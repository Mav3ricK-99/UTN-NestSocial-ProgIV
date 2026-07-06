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
  selector: 'app-profile-visits-chart',
  imports: [ChartModule, CardModule, FloatLabelModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './profile-visits-chart.component.html',
  styleUrl: './profile-visits-chart.component.css',
})
export class ProfileVisitsChartComponent implements OnInit {

  today: Date;

  public data: any;
  public options: any;

  constructor(private statsService: StatsService) {

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
          text: 'Visitas a perfiles'
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
    this.getProfileVisits();
  }

  getProfileVisits() {
    this.statsService.profileVisits().pipe(
      map((response: any) => ({
        labels: response.map((x: any) => x.username),
        datasets: [
          {
            label: 'Cantidad de visitas',
            data: response.map((x: any) => x.visitsCount),
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
