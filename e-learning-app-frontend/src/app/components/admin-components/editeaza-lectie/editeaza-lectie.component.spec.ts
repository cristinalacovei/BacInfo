import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeazaLectieComponent } from './editeaza-lectie.component';

describe('EditeazaLectieComponent', () => {
  let component: EditeazaLectieComponent;
  let fixture: ComponentFixture<EditeazaLectieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditeazaLectieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditeazaLectieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
