import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRegistrationComponent } from './cancel-registration.component';

describe('CancelRegistrationComponent', () => {
  let component: CancelRegistrationComponent;
  let fixture: ComponentFixture<CancelRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
