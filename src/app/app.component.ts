import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getMe().subscribe();
    }
  }
}

