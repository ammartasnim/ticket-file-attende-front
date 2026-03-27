import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgencyService } from 'src/app/services/agency-service';
import { CounterService } from 'src/app/services/counter-service';
import { UiService } from 'src/app/services/ui-service';
import { AgencyResponse } from 'src/app/models/agency-response';
import { CounterResponse } from 'src/app/models/counter-response';
import { addIcons } from 'ionicons';
import { arrowBackOutline, desktopOutline, lockOpenOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-agency-detail',
  templateUrl: './agency-detail.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class AgencyDetailPage implements ViewWillEnter {
  private route = inject(ActivatedRoute);
  private agencyService = inject(AgencyService);
  private counterService = inject(CounterService);
  private ui = inject(UiService);

  agency: AgencyResponse | null = null;
  counters: CounterResponse[] = [];
  agencyId!: number;

  constructor() {
    addIcons({ arrowBackOutline, desktopOutline, lockOpenOutline, lockClosedOutline });
  }

  ionViewWillEnter() {
    this.agencyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAgency();
    this.loadCounters();
  }

  loadAgency() {
    this.agencyService.getAgencyById(this.agencyId).subscribe({
      next: (data) => this.agency = data,
      error: () => this.ui.showToast('Failed to load agency', 'danger')
    });
  }

  loadCounters() {
    this.counterService.getCountersByAgency(this.agencyId).subscribe({
      next: (data) => this.counters = data,
      error: () => this.ui.showToast('Failed to load counters', 'danger')
    });
  }

  async toggleOpen() {
    if (!this.agency) return;
    const action = this.agency.open ? 'close' : 'open';
    const confirm = await this.ui.showConfirm(
      `${this.agency.open ? 'Close' : 'Open'} Agency`,
      `This will ${action} the agency for clients.`
    );
    if (!confirm) return;

    this.agencyService.toggleIsOpen(this.agencyId).subscribe({
      next: (updated) => {
        this.agency = updated;
        this.ui.showToast(`Agency is now ${updated.open ? 'open' : 'closed'}`, 'success');
      },
      error: () => this.ui.showToast('Failed to update agency status', 'danger')
    });
  }
}