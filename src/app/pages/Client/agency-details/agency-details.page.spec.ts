import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencyDetailsPage } from './agency-details.page';

describe('AgencyDetailsPage', () => {
  let component: AgencyDetailsPage;
  let fixture: ComponentFixture<AgencyDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
