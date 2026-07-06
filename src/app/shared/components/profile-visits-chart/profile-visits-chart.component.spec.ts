import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileVisitsChartComponent } from './profile-visits-chart.component';

describe('ProfileVisitsChartComponent', () => {
  let component: ProfileVisitsChartComponent;
  let fixture: ComponentFixture<ProfileVisitsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileVisitsChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileVisitsChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
