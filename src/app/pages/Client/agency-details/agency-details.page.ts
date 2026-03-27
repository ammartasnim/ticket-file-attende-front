import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgencyService } from 'src/app/services/agency-service';
import { TicketService } from 'src/app/services/ticket-service';
import { AuthService } from 'src/app/services/auth-service';
import { UiService } from 'src/app/services/ui-service';
import { ServiceService } from 'src/app/services/service-service';
import { AgencyResponse } from 'src/app/models/agency-response';
import { forkJoin } from 'rxjs';
import { addIcons } from 'ionicons';
import { timeOutline, callOutline, ticketOutline } from 'ionicons/icons';
import { TicketRequest } from 'src/app/models/ticket-request';

@Component({
  selector: 'app-agency-details',
  templateUrl: './agency-details.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class AgencyDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private agencyService = inject(AgencyService);
  private ticketService = inject(TicketService);
  private serviceService = inject(ServiceService);
  private authService = inject(AuthService);
  private ui = inject(UiService);

  agencyId!: number;
  selectedAgency: AgencyResponse | null = null;
  services: any[] = [];

  selectedServiceId: number | null = null;
  selectedDate: 'today' | 'tomorrow' = 'today';

// ... imports stay the same
  constructor() {
    addIcons({ timeOutline, callOutline, ticketOutline });
  }


  // Added a helper to store the raw ISO string for the backend
  rawPredictedDate: string = ''; 
  predictedTime: string = '';

  ngOnInit() {
    this.agencyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData() {
    forkJoin({
      agency: this.agencyService.getAgencyById(this.agencyId),
      services: this.serviceService.getServicesByAgency(this.agencyId)
    }).subscribe({
      next: ({ agency, services }) => {
        this.selectedAgency = agency;
        this.services = services;
      },
      error: () => this.ui.showToast('Failed to load agency details', 'danger')
    });
  }

  // UPDATED: Now triggers the prediction logic
  selectService(serviceId: number) {
    this.selectedServiceId = serviceId;
    this.updatePredictedTime();
  }

  // NEW: Call this when user clicks the Today/Tomorrow buttons in HTML
  changeDate(date: 'today' | 'tomorrow') {
    this.selectedDate = date;
    this.updatePredictedTime();
  }

  async updatePredictedTime() {
    if (!this.selectedServiceId) return;

    const isTomorrow = this.selectedDate === 'tomorrow';
    this.ticketService.getEarliestTime(this.agencyId, this.selectedServiceId, isTomorrow)
      .subscribe({
        next: (time) => {
          this.rawPredictedDate = time; // Save the full ISO string for the backend
          this.predictedTime = new Date(time).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        },
        error: () => this.predictedTime = 'N/A'
      });
  }

  
  async bookTicket() {
  const user = this.authService.currentUser;
  
  // 1. Check user
  if (!user || !user.id) {
    this.ui.showToast('Please login to continue', 'warning');
    return;
  }

  // 2. CRITICAL: Check if we actually have the predicted date yet
  if (!this.rawPredictedDate) {
    this.ui.showToast('Please wait for the estimated time to load...', 'warning');
    // Optional: manually trigger it if it's missing
    this.updatePredictedTime(); 
    return;
  }

  const loader = await this.ui.showLoading('Reserving...');
  
  // 3. Log this to your browser console to see EXACTLY what is being sent
  const cleanDate = this.rawPredictedDate.split('.')[0];
  console.log('Sending Date:', cleanDate);

  const request: TicketRequest = {
    clientId: user.id,
    serviceId: this.selectedServiceId!,
    agencyId: this.agencyId,
    appointmentDate: cleanDate
  };

  this.ticketService.generateTicket(request).subscribe({
    next: (ticket) => {
      loader.dismiss();
      this.router.navigate(['ticket', ticket.id]);
    },
    error: (err) => {
      loader.dismiss();
      this.ui.showToast(err.error?.message || 'Error', 'danger');
    }
  });
}
  // async bookTicket() {
  //   if (!this.selectedServiceId) return;

  //   const clientId = this.authService.currentUser?.id;
  //   if (!clientId) {
  //     this.ui.showToast('Please login to reserve a ticket', 'warning');
  //     return;
  //   }

  //   const loader = await this.ui.showLoading('Reserving your spot...');

  //   // FIX: Send the raw ISO string (rawPredictedDate) instead of "today"
  //   const request = {
  //     clientId,
  //     serviceId: this.selectedServiceId,
  //     agencyId: this.agencyId,
  //     appointmentDate: this.rawPredictedDate || new Date().toISOString().split('.')[0]
  //   };

  //   this.ticketService.generateTicket(request).subscribe({
  //     next: (ticket) => {
  //       loader.dismiss();
  //       this.ui.showToast('Ticket generated successfully!', 'success');
  //       this.router.navigate(['/client/my-ticket', ticket.id]);
  //     },
  //     error: (err) => {
  //       loader.dismiss();
  //       const msg = err.error?.message || 'The queue is full for this service.';
  //       this.ui.showToast(msg, 'danger');
  //     }
  //   });
  // }
}