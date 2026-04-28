import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, IconComponent } from '@core/ui/components';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './post-composer.component.html',
  styleUrl: './post-composer.component.css',
})
export class PostComposerComponent implements OnInit {
  readonly initialContent = input<string | null>(null);
  readonly userName = input<string>('');
  readonly userAvatar = input<string | undefined>(undefined);
  readonly onPost = output<string>();
  readonly onCancel = output<void>();

  readonly content = signal('');
  readonly focused = signal(false);
  readonly maxChars = 280;
  readonly mode = input<'create' | 'edit'>('create');
  readonly onSave = output<string>();

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

  ngOnInit() {
    if (this.initialContent()) {
      this.content.set(this.initialContent()!);
      this.focused.set(true);
    }
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

  cancel() {
    this.content.set('');
    this.focused.set(false);
    this.onCancel.emit();
  }

  submit() {
    if (!this.canSubmit) return;

    const value = this.content().trim();

    if (this.mode() === 'edit') {
      this.onSave.emit(value);
    } else {
      this.onPost.emit(value);
    }

    this.content.set('');
    this.focused.set(false);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submit();
    }
  }
}
