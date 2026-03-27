import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterService } from 'src/app/services/counter-service';
import { TicketService } from 'src/app/services/ticket-service';
import { UiService } from 'src/app/services/ui-service';
import { AuthService } from 'src/app/services/auth-service';
import { TicketResponse } from 'src/app/models/ticket-response';
import { Status } from 'src/app/models/status';
import { addIcons } from 'ionicons';
import { logOutOutline, checkmarkOutline, peopleOutline, desktopOutline, closeOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-agent-workspace',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './agent-workspace.page.html'
})
export class AgentWorkspacePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private counterService = inject(CounterService);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private ui = inject(UiService);

  counterId!: number;
  currentTicket: TicketResponse | null = null;
  waitingCount: number = 0;
  isLoading: boolean = false;
  private pollInterval: any;
  private heartbeatInterval: any;

  constructor() {
    addIcons({ logOutOutline, checkmarkOutline, peopleOutline, desktopOutline, closeOutline, arrowForwardOutline });
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.ui.showToast('No counter selected', 'danger');
      this.router.navigate(['/menu']);
      return;
    }
    this.counterId = Number(id);
    this.refreshWaitingCount();
    this.pollInterval = setInterval(() => this.refreshWaitingCount(), 60000);
    this.startHeartbeat();
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
    clearInterval(this.heartbeatInterval);
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.counterService.heartbeat(this.counterId).subscribe();
    }, 30000);
  }

  refreshWaitingCount() {
    const user = this.authService.currentUser;
    if (!user) return;
    const agencyId = this.authService.currentUser?.agencyId;
    if (!agencyId) return;
    this.ticketService.getWaitingTicketsByAgency(agencyId).subscribe({
      next: (tickets) => this.waitingCount = tickets.length,
      error: () => { }
    });
  }

  async callNextTicket() {
    this.isLoading = true;
    const loader = await this.ui.showLoading('Calling next...');

    this.ticketService.callNext(this.counterId).subscribe({
      next: (ticket) => {
        console.log('Called ticket:', ticket);
        loader.dismiss();
        this.isLoading = false;
        this.currentTicket = ticket;
        this.refreshWaitingCount();
      },
      error: (err) => {
        loader.dismiss();
        this.isLoading = false;
        if (err.status === 204 || err.status === 404) {
          this.ui.showToast('No tickets in queue', 'warning');
        } else {
          this.ui.showToast('Error calling next ticket', 'danger');
        }
      }
    });
  }

  async completeTicket() {
    if (!this.currentTicket) return;
    const loader = await this.ui.showLoading('Completing...');

    this.ticketService.completeTicket(this.currentTicket.id).subscribe({
      next: () => {
        loader.dismiss();
        this.currentTicket = null;
        this.ui.showToast('Ticket completed', 'success');
        this.refreshWaitingCount();
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Error completing ticket', 'danger');
      }
    });
  }

  async cancelCurrentTicket() {
    if (!this.currentTicket) return;
    const confirm = await this.ui.showConfirm('Cancel Ticket', 'Mark this ticket as cancelled?');
    if (!confirm) return;

    const loader = await this.ui.showLoading('Cancelling...');
    this.ticketService.cancelTicket(this.currentTicket.id).subscribe({
      next: () => {
        loader.dismiss();
        this.currentTicket = null;
        this.ui.showToast('Ticket cancelled', 'warning');
        this.refreshWaitingCount();
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Error cancelling ticket', 'danger');
      }
    });
  }

  get isTreating(): boolean {
    return this.currentTicket?.status === Status.TREATING;
  }

  async logoutWorkspace() {
    const confirm = await this.ui.showConfirm(
      'Close Counter?',
      'This will free the counter and log you out.'
    );
    if (!confirm) return;

    const loader = await this.ui.showLoading('Closing counter...');
    this.counterService.closeCounter(this.counterId).subscribe({
      next: () => {
        loader.dismiss();
        this.router.navigate(['/menu']);
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Error closing counter, logging out anyway', 'warning');
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}