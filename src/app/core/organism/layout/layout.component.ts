import { Component, inject } from '@angular/core';
import { AuthStore, UiStore } from '@store/index';
import { ButtonComponent, IconComponent } from '@core/ui/components';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, ButtonComponent, IconComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  readonly uiStore = inject(UiStore);
  readonly authStore = inject(AuthStore);
  readonly router = inject(Router);

  get user() {
    return this.authStore.currentUser();
  }

  onLogout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
