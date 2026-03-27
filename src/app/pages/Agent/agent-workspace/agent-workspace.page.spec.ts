import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentWorkspacePage } from './agent-workspace.page';

describe('AgentWorkspacePage', () => {
  let component: AgentWorkspacePage;
  let fixture: ComponentFixture<AgentWorkspacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentWorkspacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
