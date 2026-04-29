import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@store/index';
import { ButtonComponent, IconComponent } from '@core/ui/components';
import { MenuComponent, PostComposerComponent } from '@core/molecules';
import { Post, Comment } from '@core/models';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-post-card',

  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    IconComponent,
    MenuComponent,
    PostComposerComponent,
    RouterLink,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  readonly authStore = inject(AuthStore);
  readonly post = input.required<Post>();
  readonly liked = input<boolean>(false);

  readonly isOwner = computed(() => this.post().authorId === this.authStore.currentUser()?.id);
  readonly showComments = input<boolean>(false);
  readonly comments = input<Comment[]>([]);

  readonly onSaveEdit = output<{ postId: string; content: string }>();
  readonly onLike = output<void>();
  readonly onToggleComments = output<void>();
  readonly onComment = output<string>();
  readonly onDelete = output<void>();

  readonly isEditing = signal(false);
  readonly editControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });

  readonly seeMoreMenu = computed(() => {
    const user = this.authStore.currentUser();
    const post = this.post();

    if (!user || !post) return [];

    const isOwner = post.authorId === user.id;

    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'pencil',
        disabled: !isOwner,
        action: () => this.onEditPost(),
      },
      {
        id: 'delete',
        label: 'Eliminar',
        icon: 'trash-2',
        disabled: !isOwner,
        action: () => this.onDelete.emit(),
      },
    ];
  });

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

  onEditPost(): void {
    this.editControl.setValue(this.post().content);
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editControl.reset();
  }

  saveEdit(content: string): void {
    if (this.editControl.invalid) return;

    this.onSaveEdit.emit({
      postId: this.post().id,
      content: content,
    });

    this.isEditing.set(false);
  }
}
