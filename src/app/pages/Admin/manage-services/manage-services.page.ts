import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceService } from 'src/app/services/service-service';
import { UiService } from 'src/app/services/ui-service';
import { addIcons } from 'ionicons';
import { addOutline, searchOutline, trashOutline, listOutline } from 'ionicons/icons';
import { ViewWillEnter } from '@ionic/angular';

export interface ServiceResponse {
  id: number;
  name: string;
  avgTime: number;
  description: string;
}

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class ManageServicesPage implements ViewWillEnter {
  private serviceService = inject(ServiceService);
  private ui = inject(UiService);

  services: ServiceResponse[] = [];
  searchTerm: string = '';

  constructor() {
    addIcons({ addOutline, searchOutline, trashOutline, listOutline });
  }

  ionViewWillEnter() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getAllServices().subscribe({
      next: (data) => this.services = data,
      error: () => this.ui.showToast('Failed to load services', 'danger')
    });
  }

  get filteredServices() {
    const term = this.searchTerm.toLowerCase();
    return this.services.filter(s =>
      s.name?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term)
    );
  }

  async deleteService(id: number) {
    const confirm = await this.ui.showConfirm('Delete Service', 'This will permanently remove the service.');
    if (confirm) {
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.ui.showToast('Service deleted', 'success');
          this.loadServices();
        },
        error: () => this.ui.showToast('Error deleting service', 'danger')
      });
    }
  }
}