import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeazaTestComponent } from './editeaza-test.component';

describe('EditeazaTestComponent', () => {
  let component: EditeazaTestComponent;
  let fixture: ComponentFixture<EditeazaTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditeazaTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditeazaTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
