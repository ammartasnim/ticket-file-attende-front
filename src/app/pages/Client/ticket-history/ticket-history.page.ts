import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { TicketService } from 'src/app/services/ticket-service';
import { AuthService } from 'src/app/services/auth-service';
import { UiService } from 'src/app/services/ui-service';
import { TicketResponse } from 'src/app/models/ticket-response';
import { addIcons } from 'ionicons';
import { 
  receiptOutline, 
  calendarOutline, 
  constructOutline, 
  chevronForwardOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TicketHistoryPage implements ViewWillEnter {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private ui = inject(UiService);

  ticketHistory: TicketResponse[] = [];
  isLoading: boolean = false;

  constructor() {
    addIcons({ 
      receiptOutline, 
      calendarOutline, 
      constructOutline, 
      chevronForwardOutline 
    });
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  async loadHistory() {
    const user = this.authService.currentUser;
    
    if (!user || !user.id) {
      this.ui.showToast('You must be logged in to view history.', 'danger');
      return;
    }

    this.isLoading = true;
    const loader = await this.ui.showLoading('Fetching your history...');

    this.ticketService.getTicketHistory(user.id).subscribe({
      next: (data) => {
        this.ticketHistory = data.sort((a, b) => 
          new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        loader.dismiss();
        this.isLoading = false;
      },
      error: (err) => {
        loader.dismiss();
        this.isLoading = false;
        console.error('History Error:', err);
        this.ui.showToast('Could not load your ticket history.', 'danger');
      }
    });
  }

  // Helper to get status color classes for the UI
  getStatusClass(status: string) {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      case 'EXPIRED': return 'bg-zinc-50 text-zinc-500 border-zinc-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  }
}