import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personAddOutline, atOutline, lockClosedOutline, callOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth-service';
import { UiService } from 'src/app/services/ui-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private ui=inject(UiService);

  constructor() {
    addIcons({ personAddOutline, atOutline, lockClosedOutline, callOutline });
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
                console.log('Backend sent this:', res);
                this.ui.showToast('Registration successful!', 'success');
                this.goToLogin();
              },
        error: (err) => {
          console.error('Register failed!', err);
          this.ui.showToast('Registration failed!', 'danger');
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
