import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayoutPage } from './admin-layout.page';

describe('AdminLayoutPage', () => {
  let component: AdminLayoutPage;
  let fixture: ComponentFixture<AdminLayoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
