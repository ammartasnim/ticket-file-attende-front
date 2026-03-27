import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AgencyService } from 'src/app/services/agency-service';
import { UiService } from 'src/app/services/ui-service';
import { FormsModule } from '@angular/forms'; 
import { AdminService } from 'src/app/services/admin-service'; 
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  personAddOutline, 
  searchOutline, 
  trashOutline, 
  ellipsisHorizontalOutline,
  mailOutline,
  businessOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-manage-agents',
  templateUrl: './manage-agents.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, RouterLink]
})
export class ManageAgentsPage implements ViewWillEnter {
  private adminService = inject(AdminService);
  private ui = inject(UiService);

  agents: any[] = [];
  searchTerm: string = '';

  constructor() {
    addIcons({ 
      personAddOutline, searchOutline, trashOutline, 
      ellipsisHorizontalOutline, mailOutline, businessOutline 
    });
  }

  ionViewWillEnter() {
    this.loadAgents();
  }

  loadAgents() {
    this.adminService.getAllAgents().subscribe({
      next: (data) => this.agents = data,
      error: () => this.ui.showToast('Failed to load agents', 'danger')
    });
  }

  get filteredAgents() {
    return this.agents.filter(a => 
      a.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      a.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async deleteAgent(id: number) {
    const confirm = await this.ui.showConfirm('Delete Agent', 'This action is permanent.');
    if (confirm) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.ui.showToast('Agent deleted', 'success');
          this.loadAgents();
        },
        error: () => this.ui.showToast('Error deleting agent', 'danger')
      });
    }
  }
}