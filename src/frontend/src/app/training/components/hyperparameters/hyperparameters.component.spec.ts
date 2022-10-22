import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperparametersComponent } from './hyperparameters.component';

describe('HyperparametersComponent', () => {
  let component: HyperparametersComponent;
  let fixture: ComponentFixture<HyperparametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HyperparametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperparametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
