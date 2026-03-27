import { inject, Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
      cssClass: 'custom-toast',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  async showLoading(message: string = 'Please wait...') {
    const loader = await this.loadingController.create({
      message,
      spinner: 'crescent'
    });
    await loader.present();
    return loader;
  }

  async showConfirm(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'zinc-confirm-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Confirm',
          role: 'confirm',
          cssClass: 'alert-button-confirm'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}