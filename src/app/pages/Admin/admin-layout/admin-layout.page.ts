import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { addIcons } from 'ionicons';
import { 
  pieChartOutline, 
  businessOutline, 
  peopleOutline, 
  listOutline, 
  logOutOutline 
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.page.html',
  styleUrls: ['./admin-layout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, RouterLinkActive] 
})
export class AdminLayoutPage implements OnInit {
  private authService = inject(AuthService);

  constructor() {
    addIcons({ 
      pieChartOutline, 
      businessOutline, 
      peopleOutline, 
      listOutline, 
      logOutOutline 
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }
}