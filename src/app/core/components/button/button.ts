import { CommonModule } from '@angular/common';
import { Component, output, input } from '@angular/core';
import { ComponentStyles } from '@core/models';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'light'
  | 'dark';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon' | 'icon-lg';

@Component({
  selector: 'ui-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: { class: 'ignore-host' },
})
export class ButtonComponent {
  id = input<string>('');
  name = input<string>('');
  label = input<string>('');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  outlined = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  className = input<string>('');
  styles = input<ComponentStyles>({});
  onClick = output<Event>();

  get classes(): string {
    return [
      'btn',
      `btn-${this.variant()}`,
      `btn-${this.size()}`,
      this.outlined() ? 'btn-outlined' : '',
      this.className(),
    ]
      .filter(Boolean)
      .join(' ');
  }
}
