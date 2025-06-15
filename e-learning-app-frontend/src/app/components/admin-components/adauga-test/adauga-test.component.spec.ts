import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaugaTestComponent } from './adauga-test.component';

describe('AdaugaTestComponent', () => {
  let component: AdaugaTestComponent;
  let fixture: ComponentFixture<AdaugaTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdaugaTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdaugaTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
