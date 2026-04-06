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

  constructor() {
    addIcons({ timeOutline, callOutline, ticketOutline });
  }


  rawPredictedDate: string = '';

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

  selectService(serviceId: number) {
    this.selectedServiceId = serviceId;
    this.updatePredictedTime();
  }

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
          this.rawPredictedDate = time;
        }
      });
  }
 

  async bookTicket() {
    const user = this.authService.currentUser;

    if (!user || !user.id) {
      this.ui.showToast('Please login to continue', 'warning');
      return;
    }

    if (!this.rawPredictedDate) {
      this.ui.showToast('Please wait for the estimated time to load...', 'warning');
      this.updatePredictedTime();
      return;
    }

    const loader = await this.ui.showLoading('Reserving...');

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

  canBook(): boolean {
    if (!this.selectedAgency || !this.selectedServiceId || !this.rawPredictedDate) {
      return false;
    }
    if (this.selectedDate === 'tomorrow') {
      return true;
    }

    const now = new Date();
    const [closeHour, closeMinute] = this.selectedAgency.closingTime.split(':').map(Number);

    const closingTimeToday = new Date();
    closingTimeToday.setHours(closeHour, closeMinute, 0, 0);

    return now < closingTimeToday;
  }


  goBack() {
    this.router.navigate(['home']);
  }


}