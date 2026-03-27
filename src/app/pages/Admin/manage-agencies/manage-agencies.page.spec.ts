import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAgenciesPage } from './manage-agencies.page';

describe('ManageAgenciesPage', () => {
  let component: ManageAgenciesPage;
  let fixture: ComponentFixture<ManageAgenciesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAgenciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
