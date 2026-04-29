import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, IconComponent } from '@core/ui/components';

@Component({
  selector: 'app-not-found-page',

  imports: [RouterLink, ButtonComponent, IconComponent],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.css',
})
export class NotFoundPage {}
