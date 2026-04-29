import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UiStore } from '@store/index';
import { ToastComponent } from '@core/ui/components';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet />
    <ui-toast />
  `,
})
export class App implements OnInit {
  private uiStore = inject(UiStore);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.uiStore.setTheme(this.uiStore.theme());
    }
  }
}
