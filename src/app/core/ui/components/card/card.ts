import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './card.html',
  styleUrl: './card.css',

  host: { class: 'ignore-host' },
})
export class CardComponent {
  className = input<string>('');
}
