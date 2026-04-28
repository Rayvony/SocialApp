import { Component, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post, Comment } from '@store/index';
import { ButtonComponent, IconComponent } from '@core/ui/components';
@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  readonly post = input.required<Post>();
  readonly liked = input<boolean>(false);
  readonly isOwner = input<boolean>(false);
  readonly showComments = input<boolean>(false);
  readonly comments = input<Comment[]>([]);

  readonly onLike = output<void>();
  readonly onToggleComments = output<void>();
  readonly onComment = output<string>();
  readonly onDelete = output<void>();

  readonly commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });

  get timeAgo(): string {
    const diff = Date.now() - this.post().createdAt;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  submitComment() {
    if (this.commentControl.invalid) return;
    this.onComment.emit(this.commentControl.value.trim());
    this.commentControl.reset();
  }

  onCommentKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      this.submitComment();
    }
  }
}
