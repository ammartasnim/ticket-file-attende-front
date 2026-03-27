import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Role } from 'src/app/models/role';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  atOutline, 
  lockClosedOutline, 
  arrowForwardOutline 
} from 'ionicons/icons';
import { UiService } from 'src/app/services/ui-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginPage implements OnInit {
  constructor() {
    addIcons({ 
      mailOutline, 
      atOutline, 
      lockClosedOutline, 
      arrowForwardOutline 
    });
  }

  loginForm!:FormGroup;
  private fb=inject(FormBuilder);
  private authService=inject(AuthService);
  private router=inject(Router);
  private ui=inject(UiService);

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]]
    });
  }
  onLogin() {
  if (!this.loginForm.valid) return;

  this.authService.login(this.loginForm.value).subscribe({
    next: (res) => {
      this.ui.showToast('Login successful!', 'success');
      if (res.role === Role.ADMIN) this.router.navigate(['/admin']);
      else if (res.role === Role.AGENT) this.router.navigate(['/menu']);
      else this.router.navigate(['/home']);
    },
    error: () => this.ui.showToast('Login failed!', 'danger')
  });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
