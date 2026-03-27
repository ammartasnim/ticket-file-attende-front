import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgencyService } from 'src/app/services/agency-service';
import { UiService } from 'src/app/services/ui-service';
import { AuthService } from 'src/app/services/auth-service';
import { AgencyResponse } from 'src/app/models/agency-response';
import { addIcons } from 'ionicons';
import { searchOutline, locationOutline, chevronForwardOutline, receiptOutline,personCircleOutline, logOutOutline } from 'ionicons/icons';
import { UserResponse } from 'src/app/models/user-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class HomePage implements ViewWillEnter {
  private agencyService = inject(AgencyService);
  private ui = inject(UiService);
  private router = inject(Router);
  private authService = inject(AuthService);

  agencies: AgencyResponse[] = [];
  searchQuery: string = '';
  currentUser: UserResponse | null = null;

  constructor() {
    addIcons({ searchOutline, locationOutline, receiptOutline, logOutOutline, chevronForwardOutline, personCircleOutline });
  }

  ionViewWillEnter() {
    this.authService.getMe().subscribe(user => {
    this.currentUser = user;
  });
    this.loadAgencies();
  }

  async loadAgencies() {
    const loader = await this.ui.showLoading('Finding agencies...');
    this.agencyService.getAllAgencies().subscribe({
      next: (data) => {
        this.agencies = data;
        loader.dismiss();
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Failed to load agencies', 'danger');
      }
    });
  }

  get filteredAgencies(): AgencyResponse[] {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.agencies;
    return this.agencies.filter(a =>
      a.name?.toLowerCase().includes(q) ||
      a.address?.toLowerCase().includes(q) ||
      a.city?.toLowerCase().includes(q)
    );
  }

  goToDetails(agency: AgencyResponse) {
    this.router.navigate(['/agency', agency.id]);
  }

  goToMyTicket() {
    if (this.currentUser?.activeTicketId) {
      this.router.navigate(['/ticket', this.currentUser.activeTicketId]);
    }
  }

  goToHistory(){
    this.router.navigate(['/history']);
  }

  onLogout() {
    this.authService.logout();
  }
}