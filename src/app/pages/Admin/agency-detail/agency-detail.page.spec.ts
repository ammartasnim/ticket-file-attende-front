import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencyDetailPage } from './agency-detail.page';

describe('AgencyDetailPage', () => {
  let component: AgencyDetailPage;
  let fixture: ComponentFixture<AgencyDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
