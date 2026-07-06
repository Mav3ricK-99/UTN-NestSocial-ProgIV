import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPerUserChartComponent } from './post-per-user-chart.component';

describe('PostPerUserChartComponent', () => {
  let component: PostPerUserChartComponent;
  let fixture: ComponentFixture<PostPerUserChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPerUserChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostPerUserChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
