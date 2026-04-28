import { Component, inject, OnInit, afterNextRender } from '@angular/core';
import { ButtonComponent, CardComponent } from '@core/components';
import { ToastService } from '@core/services';

@Component({
  selector: 'app-login-page',
  template: `<p>Login</p>
    <ui-card>
      <ui-button (onClick)="toast()">BUENAS</ui-button>
    </ui-card> `,
  imports: [ButtonComponent, CardComponent],
})
export class LoginPage implements OnInit {
  private readonly toastService = inject(ToastService);

  ngOnInit() {
    afterNextRender(() => {
      this.toast();
    });
  }

  toast() {
    this.toastService.error('Error', 'detail', 1000000);
  }
}
