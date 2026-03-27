import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin-service';
import { AgencyService } from 'src/app/services/agency-service';
import { UiService } from 'src/app/services/ui-service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddAgentPage implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private agencyService = inject(AgencyService);
  private ui = inject(UiService);
  private router = inject(Router);

  agentForm!: FormGroup;
  agencies: any[] = [];

  constructor() {
    addIcons({ arrowBackOutline, chevronDownOutline });
  }

  ngOnInit() {
    this.initForm();
    this.loadAgencies();
  }

  initForm() {
    this.agentForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required]],
      agencyId: [null, [Validators.required]]
    });
  }

  loadAgencies() {
    this.agencyService.getAllAgencies().subscribe({
      next: (data) => {this.agencies = data; console.log('Agencies loaded:', this.agencies);},
      error: () => this.ui.showToast('Could not load agencies', 'danger')
    });
  }

  onCancel(){
    this.router.navigate(['/admin/agents']);
  }

  async onSubmit() {
    if (this.agentForm.valid) {
      const loader = await this.ui.showLoading('Creating agent account...');
      
      const { agencyId, ...registerData } = this.agentForm.value;

      this.adminService.registerAgent(registerData, agencyId).subscribe({
        next: () => {
          loader.dismiss();
          this.ui.showToast('Agent created successfully!', 'success');
          this.router.navigate(['/admin/agents']);
        },
        error: (err) => {
          loader.dismiss();
          this.ui.showToast('Failed to create agent', 'danger');
        }
      });
    } else {
      this.ui.showToast('Please fill in all required fields', 'warning');
    }
  }
}