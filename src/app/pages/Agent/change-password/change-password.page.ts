import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service';
import { UiService } from 'src/app/services/ui-service';
import { addIcons } from 'ionicons';
import { keyOutline, lockClosedOutline, eyeOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './change-password.page.html'
})
export class ChangePasswordPage {
  private modalCtrl = inject(ModalController);
  private authService = inject(AuthService);
  private ui = inject(UiService);

  data = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor() {
    addIcons({ keyOutline, lockClosedOutline, eyeOutline, closeOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (!this.data.oldPassword || !this.data.newPassword) {
      this.ui.showToast('Please fill all fields', 'warning');
      return;
    }

    if (this.data.newPassword !== this.data.confirmPassword) {
      this.ui.showToast('Passwords do not match', 'danger');
      return;
    }

    const loader = await this.ui.showLoading('Updating security...');
    
    this.authService.changePassword({
      oldPassword: this.data.oldPassword,
      newPassword: this.data.newPassword
    }).subscribe({
      next: () => {
        loader.dismiss();
        this.ui.showToast('Password updated successfully', 'success');
        this.modalCtrl.dismiss(true);
      },
      error: (err) => {
        loader.dismiss();
        this.ui.showToast(err.error?.message || 'Update failed', 'danger');
      }
    });
  }
}