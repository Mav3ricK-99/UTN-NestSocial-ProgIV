import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostInFeedComponent } from './new-post-in-feed.component';

describe('NewPostInFeedComponent', () => {
  let component: NewPostInFeedComponent;
  let fixture: ComponentFixture<NewPostInFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPostInFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostInFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
