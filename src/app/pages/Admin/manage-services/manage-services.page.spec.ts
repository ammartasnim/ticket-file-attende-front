import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageServicesPage } from './manage-services.page';

describe('ManageServicesPage', () => {
  let component: ManageServicesPage;
  let fixture: ComponentFixture<ManageServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
