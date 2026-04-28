import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ComponentStyles } from '@core/models';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorVariant = 'default' | 'muted' | 'strong';
export type SeparatorSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-separator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './separator.html',
  styleUrl: './separator.css',
  host: { class: 'ignore-host' },
})
export class Separator {
  readonly orientation = input<SeparatorOrientation>('horizontal');
  readonly variant = input<SeparatorVariant>('default');
  readonly size = input<SeparatorSize>('md');
  readonly className = input<string>('');
  readonly styles = input<ComponentStyles>({});
  readonly decorative = input<boolean>(true);

  get classes(): string {
    return [
      'separator',
      `separator-${this.orientation()}`,
      `separator-${this.variant()}`,
      `separator-${this.size()}`,
      this.className(),
    ]
      .filter(Boolean)
      .join(' ');
  }
}
