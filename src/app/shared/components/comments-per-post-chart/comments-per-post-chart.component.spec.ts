import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPerPostChartComponent } from './comments-per-post-chart.component';

describe('CommentsPerPostChartComponent', () => {
  let component: CommentsPerPostChartComponent;
  let fixture: ComponentFixture<CommentsPerPostChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsPerPostChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsPerPostChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
