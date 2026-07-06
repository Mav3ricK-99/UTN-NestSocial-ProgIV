import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogginsPerUserChartComponent } from './loggins-per-user-chart.component';

describe('LogginsPerUserChartComponent', () => {
  let component: LogginsPerUserChartComponent;
  let fixture: ComponentFixture<LogginsPerUserChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogginsPerUserChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogginsPerUserChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
