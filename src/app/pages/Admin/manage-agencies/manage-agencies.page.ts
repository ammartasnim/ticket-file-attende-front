import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgencyService } from 'src/app/services/agency-service';
import { UiService } from 'src/app/services/ui-service';
import { AgencyResponse } from 'src/app/models/agency-response';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, searchOutline, trashOutline, eyeOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-manage-agencies',
  templateUrl: './manage-agencies.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class ManageAgenciesPage implements ViewWillEnter {
  private agencyService = inject(AgencyService);
  private ui = inject(UiService);
  private router = inject(Router);

  agencies: AgencyResponse[] = [];
  searchTerm: string = '';

  constructor() {
    addIcons({ addOutline, searchOutline, trashOutline, eyeOutline, businessOutline });
  }

  ionViewWillEnter() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.agencyService.getAllAgencies().subscribe({
      next: (data) => this.agencies = data,
      error: () => this.ui.showToast('Failed to load agencies', 'danger')
    });
  }

  get filteredAgencies() {
    const term = this.searchTerm.toLowerCase();
    return this.agencies.filter(a =>
      a.name?.toLowerCase().includes(term) ||
      a.city?.toLowerCase().includes(term)
    );
  }

  async deleteAgency(id: number) {
    const confirm = await this.ui.showConfirm('Delete Agency', 'This will permanently remove the agency.');
    if (confirm) {
      this.agencyService.deleteAgency(id).subscribe({
        next: () => {
          this.ui.showToast('Agency deleted', 'success');
          this.loadAgencies();
        },
        error: () => this.ui.showToast('Error deleting agency', 'danger')
      });
    }
  }

  viewAgency(id: number) {
  this.router.navigate(['/admin/agencies', id]);
}
}