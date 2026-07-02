import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingSessionComponent } from './closing-session.component';

describe('ClosingSessionComponent', () => {
  let component: ClosingSessionComponent;
  let fixture: ComponentFixture<ClosingSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosingSessionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClosingSessionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
