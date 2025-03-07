import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectiiComponent } from './lectii.component';

describe('LectiiComponent', () => {
  let component: LectiiComponent;
  let fixture: ComponentFixture<LectiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LectiiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
