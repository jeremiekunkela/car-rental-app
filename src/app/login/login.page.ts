import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { AuthenticationService, IUser } from '../services/authentication/auth.service';
import { Router } from '@angular/router';
import { ToastController } from "@ionic/angular";
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule,
    ReactiveFormsModule
  ],
  providers: [ToastController]  
})
export class LoginPage implements OnInit {

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    const errors: { [key: string]: string | (() => string) } = {
      required: 'Ce champ est requis.',
      minlength: () => `Minimum ${control?.getError('minlength')?.requiredLength} caractères requis.`,
      email: 'Adresse email invalide.',
      pattern: 'Format invalide.',
    };
  
    const errorKey = Object.keys(errors).find(key => control?.hasError(key));
    if (errorKey) {
      const error = errors[errorKey];
      return typeof error === 'function' ? error() : error;
    }
    return '';
  }

  validateLoginForm(): boolean {
    this.errorMessage = '';
  
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return false;
    }
  
    return true;
  }

  async login() {
    if (!this.validateLoginForm()) return;
  
    try {
      const {email, password} = this.loginForm.value;
      if (email && password) {
        await this.authService.signInWithEmailAndPassword({
          email,
          password
        });
        this.router.navigate(['/car-list']);
      }
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        this.presentToast('Utilisateur inconnu. Veuillez vérifier vos identifiants.', 'warning');
        return;
      }
    
      this.presentToast('Erreur du serveur. Veuillez réessayer plus tard.', 'danger');
    }
  }
  
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',  
      cssClass: 'custom-toast',  
    });
    toast.present();
  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }
}
