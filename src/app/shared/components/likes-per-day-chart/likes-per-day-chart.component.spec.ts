import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesPerDayChartComponent } from './likes-per-day-chart.component';

describe('LikesPerDayChartComponent', () => {
  let component: LikesPerDayChartComponent;
  let fixture: ComponentFixture<LikesPerDayChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikesPerDayChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LikesPerDayChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
