import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service-service';
import { UiService } from 'src/app/services/ui-service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddServicePage implements OnInit {
  private fb = inject(FormBuilder);
  private serviceService = inject(ServiceService);
  private ui = inject(UiService);
  private router = inject(Router);

  serviceForm!: FormGroup;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.serviceForm = this.fb.group({
      name:        ['', [Validators.required]],
      description: [''],
      avgTime:     [null, [Validators.required, Validators.min(1)]]
    });
  }

  onCancel() {
    this.router.navigate(['/admin/services']);
  }

  async onSubmit() {
    if (this.serviceForm.invalid) {
      this.ui.showToast('Please fill in all required fields', 'warning');
      return;
    }
    const loader = await this.ui.showLoading('Creating service...');
    this.serviceService.createService(this.serviceForm.value).subscribe({
      next: () => {
        loader.dismiss();
        this.ui.showToast('Service created successfully!', 'success');
        this.router.navigate(['/admin/services']);
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Failed to create service', 'danger');
      }
    });
  }
}