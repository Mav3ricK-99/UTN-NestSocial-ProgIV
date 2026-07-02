import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPostComponent } from './show-post.component';

describe('ShowPostComponent', () => {
  let component: ShowPostComponent;
  let fixture: ComponentFixture<ShowPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowPostComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
