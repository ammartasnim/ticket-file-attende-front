import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket-service';
import { AuthService } from 'src/app/services/auth-service';
import { UiService } from 'src/app/services/ui-service';
import { TicketResponse } from 'src/app/models/ticket-response';
import { Status } from 'src/app/models/status';
import { addIcons } from 'ionicons';
import { closeOutline, chevronBackOutline, timeOutline, locationOutline, ticketOutline, pin } from 'ionicons/icons';
import QRCode from 'qrcode';
import { AgencyService } from 'src/app/services/agency-service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TicketPage implements OnInit, OnDestroy {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private agencyService = inject(AgencyService);
  private ui = inject(UiService);

  ticketId!: number;
  ticket: TicketResponse | null = null;
  position: number | null = null;
  waitTime: number | null = null;
  isLoading = true;
  openingTimeStr: string = '—';
closingTimeStr: string = '—';

  private pollInterval: any;

  constructor() {
    addIcons({ closeOutline, chevronBackOutline, timeOutline, locationOutline, ticketOutline });
  }

  ngOnInit() {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicketData();
    this.pollInterval = setInterval(() => this.loadTicketData(), 30000);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
  }

  loadTicketData() {
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        if (t.agencyName) {
        this.agencyService.getAgencyByName(t.agencyName).subscribe({
          next: (agency) => {
            console.log('Agency details:', agency);
            this.openingTimeStr = agency.openingTime;
            this.closingTimeStr = agency.closingTime;
          }
        });
      }
    if (this.ticket?.status === 'TREATING') {
      this.notifyUser();
    }
        setTimeout(() => this.generateQR(), 100);
      }
    });

    this.ticketService.getQueuePosition(this.ticketId).subscribe({
      next: (pos) => this.position = pos
    });

    this.ticketService.getWaitTime(this.ticketId).subscribe({
      next: (time) => this.waitTime = time
    });
  }

  async notifyUser() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "C'est votre tour !",
          body: `Veuillez vous diriger vers le guichet n°${this.ticket?.counterNumber}`,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'beep.wav',
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }

  async generateQR() {
    if (!this.ticket?.uuid || !this.qrCanvas?.nativeElement) return;
    try {
      // const qrData = {
      //   ticketNumber: this.ticket.uuid,
      //   pin: this.ticket.pin,
      //   client: this.authService.currentUser?.firstName + ' ' + this.authService.currentUser?.lastName || 'Client',
      //   service: this.ticket.serviceName,
      //   agency: this.ticket.agencyName,
      //   date: this.ticket.appointmentDate,
      //   status: this.statusLabel
      // };

      // const qrString = JSON.stringify(qrData);
      const qrText = `
Informations du ticket
----------------------
Ticket: ${this.ticket.pin}
Service: ${this.ticket.serviceName}
Agence: ${this.ticket.agencyName}
Date: ${this.ticket.appointmentDate}
ID: ${this.ticket.uuid}
    `.trim();

      await QRCode.toCanvas(this.qrCanvas.nativeElement, qrText, {
        width: 180,
        margin: 1,
        color: {
          dark: '#18181b',
          light: '#ffffff'
        }
      });
    } catch (e) {
      console.error('QR generation failed', e);
    }
  }

  get statusLabel(): string {
    switch (this.ticket?.status) {
      case Status.GENERATED: return 'Generated';
      case Status.TREATING: return 'Being Served';
      case Status.COMPLETED: return 'Completed';
      case Status.CANCELED: return 'Canceled';
      case Status.EXPIRED: return 'Expired';
      default: return 'Called';
    }
  }

  async cancelTicket() {
    const confirm = await this.ui.showConfirm('Cancel Ticket', 'Are you sure you want to leave the queue?');
    if (!confirm) return;

    const loader = await this.ui.showLoading('Cancelling...');
    this.ticketService.cancelTicket(this.ticketId).subscribe({
      next: () => {
        loader.dismiss();
        this.ui.showToast('You have left the queue', 'success');
        this.router.navigate(['/home']);
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Could not cancel ticket', 'danger');
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
