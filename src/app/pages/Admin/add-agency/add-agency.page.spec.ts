import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAgencyPage } from './add-agency.page';

describe('AddAgencyPage', () => {
  let component: AddAgencyPage;
  let fixture: ComponentFixture<AddAgencyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
