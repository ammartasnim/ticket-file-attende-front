import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AdminService } from 'src/app/services/admin-service';
import { UiService } from 'src/app/services/ui-service';
import { DashboardStats } from 'src/app/models/dashboard-stats';
import { addIcons } from 'ionicons';
import {
  businessOutline, peopleOutline, ticketOutline,
  desktopOutline, addOutline, personAddOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, DatePipe]
})
export class DashboardPage implements ViewWillEnter {
  private adminService = inject(AdminService);
  private ui = inject(UiService);

  today = new Date();
  stats: DashboardStats | null = null;
  isLoading = true;

  constructor() {
    addIcons({ businessOutline, peopleOutline, ticketOutline, desktopOutline, addOutline, personAddOutline, arrowForwardOutline });
  }

  ionViewWillEnter() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.ui.showToast('Failed to load dashboard', 'danger');
        this.isLoading = false;
      }
    });
  }
}