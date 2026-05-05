import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEducation } from './manage-education';

describe('ManageEducation', () => {
  let component: ManageEducation;
  let fixture: ComponentFixture<ManageEducation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEducation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEducation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
