import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectieComponent } from './lectie.component';

describe('LectieComponent', () => {
  let component: LectieComponent;
  let fixture: ComponentFixture<LectieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LectieComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LectieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
