import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AgencyService } from 'src/app/services/agency-service';
import { CounterService } from 'src/app/services/counter-service';
import { UiService } from 'src/app/services/ui-service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddAgencyPage implements OnInit {
  private fb = inject(FormBuilder);
  private agencyService = inject(AgencyService);
  private counterService = inject(CounterService);
  private ui = inject(UiService);
  private router = inject(Router);

  agencyForm!: FormGroup;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.agencyForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      openingTime: ['', [Validators.required]],
      closingTime: ['', [Validators.required]],
      maxCapacity: [null, [Validators.required, Validators.min(1)]],
      nbrCounters: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onCancel() {
    this.router.navigate(['/admin/agencies']);
  }

  async onSubmit() {
    if (this.agencyForm.invalid) {
      this.ui.showToast('Please fill in all required fields', 'warning');
      return;
    }
    const loader = await this.ui.showLoading('Creating agency...');

    this.agencyService.createAgency(this.agencyForm.value).subscribe({
      next: () => {
        loader.dismiss();
        this.ui.showToast('Agency created successfully!', 'success');
        this.router.navigate(['/admin/agencies']);
      },
      error: () => {
        loader.dismiss();
        this.ui.showToast('Failed to create agency', 'danger');
      }
    });
  }
}