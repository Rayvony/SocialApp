import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentStyles, OnChangeEvent } from '@core/models';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
  host: { class: 'ignore-host' },
})
export class InputComponent {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly className = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<string>('text');
  readonly control = input<FormControl>(new FormControl());
  readonly styles = input<ComponentStyles>({});

  readonly onChange = output<OnChangeEvent>();
  readonly onFocus = output<Event>();
  readonly onBlur = output<Event>();
  readonly onKeyDown = output<KeyboardEvent>();

  readonly invalid = computed(() => this.control()?.touched && this.control()?.invalid);
  readonly disabled = computed(() => this.control()?.disabled ?? false);

  handleChange(event: Event) {
    if (this.disabled()) return;
    this.onChange.emit({ value: this.control()?.value, event });
  }
  handleFocus(event: Event) {
    if (this.disabled()) return;
    this.onFocus.emit(event);
  }
  handleBlur(event: Event) {
    if (this.disabled()) return;
    this.onBlur.emit(event);
  }
  handleKeyDown(event: KeyboardEvent) {
    if (this.disabled()) return;
    this.onKeyDown.emit(event);
  }
}
