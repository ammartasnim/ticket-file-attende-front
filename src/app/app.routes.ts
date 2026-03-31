import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role-guard';
import { AdminLayoutPage } from './pages/Admin/admin-layout/admin-layout.page';
import { DashboardPage } from './pages/Admin/dashboard/dashboard.page';
import { ManageServicesPage } from './pages/Admin/manage-services/manage-services.page';
import { ManageAgenciesPage } from './pages/Admin/manage-agencies/manage-agencies.page';
import { ManageAgentsPage } from './pages/Admin/manage-agents/manage-agents.page';
import { AddAgentPage } from './pages/Admin/add-agent/add-agent.page';
import { AddAgencyPage } from './pages/Admin/add-agency/add-agency.page';
import { AddServicePage } from './pages/Admin/add-service/add-service.page';
import { AgencyDetailPage } from './pages/Admin/agency-detail/agency-detail.page';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'admin',
    component: AdminLayoutPage,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'agents', component: ManageAgentsPage },
      { path: 'agents/add', component: AddAgentPage },
      { path: 'agencies', component: ManageAgenciesPage },
      { path: 'agencies/add', component: AddAgencyPage },
      { path: 'agencies/:id', component: AgencyDetailPage },
      { path: 'services', component: ManageServicesPage },
      { path: 'services/add', component: AddServicePage },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'menu',
    canActivate: [roleGuard],
    data: { roles: ['AGENT'] },
    loadComponent: () => import('./pages/Agent/menu/menu.page').then(m => m.MenuPage)
  },
  {
    path: 'workspace/:id',
    canActivate: [roleGuard],
    data: { roles: ['AGENT'] },
    loadComponent: () => import('./pages/Agent/agent-workspace/agent-workspace.page').then(m => m.AgentWorkspacePage)
  },
  {
    path: 'change-password',
    canActivate: [roleGuard],
    data: { roles: ['AGENT', 'ADMIN', 'CLIENT'] },
    loadComponent: () => import('./pages/Agent/change-password/change-password.page').then(m => m.ChangePasswordPage)
  },

  {
    path: 'home',
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] },
    loadComponent: () => import('./pages/Client/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'agency/:id',
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] },
    loadComponent: () => import('./pages/Client/agency-details/agency-details.page').then(m => m.AgencyDetailsPage)
  },
  {
    path: 'ticket/:id',
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] },
    loadComponent: () => import('./pages/Client/ticket/ticket.page').then(m => m.TicketPage)
  },
  {
    path: 'history',
    canActivate: [roleGuard],
    data: { roles: ['CLIENT'] },
    loadComponent: () => import('./pages/Client/ticket-history/ticket-history.page').then(m => m.TicketHistoryPage)
  },

  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];