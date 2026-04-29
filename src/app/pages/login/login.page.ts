import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore, UiStore } from '@store/index';
import { ButtonComponent, CardComponent, IconComponent, InputComponent } from '@core/ui/components';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, IconComponent, CardComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  readonly authStore = inject(AuthStore);
  readonly uiStore = inject(UiStore);
  readonly router = inject(Router);
  readonly platformId = inject(PLATFORM_ID);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailControl() {
    return this.form.controls.email;
  }
  get passwordControl() {
    return this.form.controls.password;
  }

  get emailError(): string {
    const c = this.emailControl;
    if (!c.touched) return '';
    if (c.hasError('required')) return 'El email es requerido';
    if (c.hasError('email')) return 'Formato de email inválido';
    return '';
  }

  get passwordError(): string {
    const c = this.passwordControl;
    if (!c.touched) return '';
    if (c.hasError('required')) return 'La contraseña es requerida';
    if (c.hasError('minlength')) return 'Mínimo 6 caracteres';
    return '';
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    await this.authStore.loginWithEmail(email, password);

    if (this.authStore.isAuthenticated()) {
      this.uiStore.success(
        `¡Bienvenido, ${this.authStore.currentUser()?.name}!`,
        'Sesión iniciada correctamente.',
      );
      this.router.navigate(['/feed']);
    } else if (this.authStore.error()) {
      this.uiStore.danger('Error al iniciar sesión', this.authStore.error()!);
    }
  }

  async onGoogleLogin() {
    await this.authStore.loginWithGoogle();

    if (this.authStore.isAuthenticated()) {
      this.uiStore.success(
        `¡Bienvenido, ${this.authStore.currentUser()?.name}!`,
        'Sesión iniciada con Google.',
      );
      this.router.navigate(['/feed']);
    }
  }
}
