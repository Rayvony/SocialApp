import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, IconComponent } from '@core/ui/components';

export interface PostComposerSubmit {
  content: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-post-composer',
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './post-composer.component.html',
  styleUrl: './post-composer.component.css',
})
export class PostComposerComponent implements OnInit {
  readonly initialContent = input<string | null>(null);
  readonly userName = input<string>('');
  readonly userAvatar = input<string | undefined>(undefined);

  readonly onPost = output<PostComposerSubmit>();
  readonly onCancel = output<void>();
  readonly onSave = output<string>();

  readonly content = signal('');
  readonly imageUrl = signal<string | undefined>(undefined);
  readonly focused = signal(false);

  readonly maxChars = 280;
  readonly mode = input<'create' | 'edit'>('create');

  get charsLeft() {
    return this.maxChars - this.content().length;
  }

  get isOverLimit() {
    return this.charsLeft < 0;
  }

  get canSubmit() {
    return (this.content().trim().length > 0 || !!this.imageUrl()) && !this.isOverLimit;
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
    this.focused.set(this.content().length > 0 || !!this.imageUrl());
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
      this.focused.set(true);
    };

    reader.readAsDataURL(file);
    input.value = '';
  }

  removeImage() {
    this.imageUrl.set(undefined);
  }

  cancel() {
    this.content.set('');
    this.imageUrl.set(undefined);
    this.focused.set(false);
    this.onCancel.emit();
  }

  submit() {
    if (!this.canSubmit) return;

    const value = this.content().trim();

    if (this.mode() === 'edit') {
      this.onSave.emit(value);
    } else {
      this.onPost.emit({
        content: value,
        imageUrl: this.imageUrl(),
      });
    }

    this.content.set('');
    this.imageUrl.set(undefined);
    this.focused.set(false);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submit();
    }

    if (event.key === 'Escape') {
      this.cancel();
    }
  }
}
