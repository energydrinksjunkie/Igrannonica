import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDatasetComponent } from './modify-dataset.component';

describe('ModifyDatasetComponent', () => {
  let component: ModifyDatasetComponent;
  let fixture: ComponentFixture<ModifyDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
