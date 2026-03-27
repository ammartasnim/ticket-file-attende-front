import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui-service';
import { AuthService } from 'src/app/services/auth-service';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  desktopOutline,
  chevronForwardOutline,
  constructOutline,
  keyOutline,
  logOutOutline
} from 'ionicons/icons';
import { CounterResponse } from 'src/app/models/counter-response';
import { CounterService } from 'src/app/services/counter-service';
import { ChangePasswordPage } from '../change-password/change-password.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MenuPage implements ViewWillEnter {
  private counterService = inject(CounterService);
  private ui = inject(UiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  agentName: string = 'Agent';
  agencyName: string = 'Loading...';
  counters: CounterResponse[] = [];

  constructor() {
    addIcons({ locationOutline, keyOutline, desktopOutline, chevronForwardOutline, constructOutline, logOutOutline });
  }

  async ionViewWillEnter() {
    const user = this.authService.currentUser;
    if (!user || !user.agencyId) {
      this.ui.showToast('No agency found for this account.', 'danger');
      return;
    }
    if (user.counterId) {
      this.router.navigate(['/workspace', user.counterId]);
      return;
    }

    this.agentName = user.firstName;
    this.loadCounters(user);
  }

  async loadCounters(user: any) {
    const loader = await this.ui.showLoading(`Connecting to ${this.agentName}'s workspace...`);

    this.counterService.getCountersByAgency(user.agencyId).subscribe({
      next: (data) => {
        this.counters = Array.isArray(data) ? data : [data];
        this.agencyName = this.counters.length > 0
          ? this.counters[0].agencyName
          : (user.agencyName || 'Agency');
        loader.dismiss();
      },
      error: (err) => {
        loader.dismiss();
        console.error('Fetch error:', err);
        this.ui.showToast('Could not load agency counters', 'danger');
      }
    });
  }

  async selectCounter(counter: CounterResponse) {
    if (counter.currentAgentName && counter.currentAgentName !== this.agentName) {
      this.ui.showToast(`Counter #${counter.number} is occupied by ${counter.currentAgentName}`, 'warning');
      return;
    }

    const agentId = this.authService.currentUser?.id;
    if (!agentId) return;

    const loader = await this.ui.showLoading('Opening counter...');
    this.counterService.openCounter(counter.id, agentId).subscribe({
      next: () => {
        loader.dismiss();
        this.ui.showToast(`Counter #${counter.number} is now yours.`, 'success');
        this.router.navigate(['workspace/', counter.id]);
      },
      error: (err) => {
        loader.dismiss();
        console.error('Open counter error:', err.error);
        this.ui.showToast('Could not open counter', 'danger');
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }


async openChangePassword() {
  const modal = await this.modalCtrl.create({
    component: ChangePasswordPage,
    breakpoints: [0, 1],
    initialBreakpoint: 1,
    handle: true,
  });
  return await modal.present();
}
}