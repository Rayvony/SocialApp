import { Component } from '@angular/core';
import { ButtonComponent, CardComponent } from '@core/components';

@Component({
  selector: 'app-login-page',
  template: `<p>Login</p>
    <ui-card>
      <ui-button>BUENAS</ui-button>
    </ui-card> `,
  imports: [ButtonComponent, CardComponent],
})
export class LoginPage {}
