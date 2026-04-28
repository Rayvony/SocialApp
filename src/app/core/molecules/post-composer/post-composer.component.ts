import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, IconComponent } from '@core/ui/components';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './post-composer.component.html',
  styleUrl: './post-composer.component.css',
})
export class PostComposerComponent {
  readonly userName = input<string>('');
  readonly userAvatar = input<string | undefined>(undefined);
  readonly onPost = output<string>();

  readonly content = signal('');
  readonly focused = signal(false);
  readonly maxChars = 280;

  get charsLeft() {
    return this.maxChars - this.content().length;
  }
  get isOverLimit() {
    return this.charsLeft < 0;
  }
  get canSubmit() {
    return this.content().trim().length > 0 && !this.isOverLimit;
  }
  get charsClass() {
    return this.charsLeft < 20
      ? this.isOverLimit
        ? 'composer-chars-over'
        : 'composer-chars-warn'
      : 'composer-chars';
  }

  onInput(value: string) {
    this.content.set(value);
  }
  onFocus() {
    this.focused.set(true);
  }
  onBlur() {
    this.focused.set(this.content().length > 0);
  }

  submit() {
    if (!this.canSubmit) return;
    this.onPost.emit(this.content().trim());
    this.content.set('');
    this.focused.set(false);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submit();
    }
  }
}
