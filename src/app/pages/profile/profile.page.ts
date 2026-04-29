import { Component, inject, computed, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@store/auth/auth.store';
import { PostsStore, Post } from '@store/posts/posts.store';
import { UiStore } from '@store/ui/ui.store';
import { CommentsStore } from '@store/comments/comments.store';
import { ButtonComponent, CardComponent, IconComponent } from '@core/ui/components';
import { PostCardComponent } from '@core/organism/index';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, CardComponent, PostCardComponent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
})
export class ProfilePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  readonly authStore = inject(AuthStore);
  readonly postsStore = inject(PostsStore);
  readonly commentsStore = inject(CommentsStore);
  readonly uiStore = inject(UiStore);

  readonly editing = signal(false);
  readonly expandedPostId = signal<string | null>(null);

  readonly profileId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');
  readonly isOwn = computed(() => this.profileId() === this.authStore.currentUser()?.id);

  readonly profileUser = computed(() => {
    const id = this.profileId();
    const current = this.authStore.currentUser();
    if (current?.id === id) return current;
    const post = this.postsStore.posts().find((p) => p.authorId === id);
    if (!post) return null;
    return {
      id,
      name: post.authorName,
      email: '',
      avatar: post.authorAvatar,
      provider: 'email' as const,
    };
  });

  readonly userPosts = computed(() =>
    this.postsStore.sortedPosts().filter((p) => p.authorId === this.profileId()),
  );

  readonly stats = computed(() => {
    const posts = this.userPosts();
    return {
      totalPosts: posts.length,
      totalLikes: posts.reduce((acc, p) => acc + p.likes.length, 0),
      totalComments: posts.reduce((acc, p) => acc + p.commentCount, 0),
    };
  });

  readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  startEditing() {
    this.nameControl.setValue(this.profileUser()?.name ?? '');
    this.editing.set(true);
  }

  cancelEditing() {
    this.editing.set(false);
  }

  saveProfile() {
    if (this.nameControl.invalid) return;
    const current = this.authStore.currentUser();
    if (!current) return;

    const updated = { ...current, name: this.nameControl.value.trim() };
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }

    this.uiStore.success('Perfil actualizado');
    this.editing.set(false);
  }

  onToggleLike(postId: string) {
    const user = this.authStore.currentUser();
    if (!user) return;
    this.postsStore.toggleLike(postId, user.id);
  }

  onToggleComments(postId: string) {
    this.expandedPostId.update((id) => (id === postId ? null : postId));
  }

  onCommentAdded(postId: string, content: string) {
    const user = this.authStore.currentUser();
    if (!user) return;
    this.commentsStore.addComment(postId, content, user);
    this.postsStore.incrementCommentCount(postId);
  }

  onDeletePost(postId: string) {
    const user = this.authStore.currentUser();
    if (!user) return;
    this.postsStore.deletePost(postId, user.id);
    this.uiStore.info('Post eliminado');
  }

  isLiked(post: Post) {
    return post.likes.includes(this.authStore.currentUser()?.id ?? '');
  }

  commentsForPost(postId: string) {
    return this.commentsStore.getCommentsForPost(postId);
  }

  goBack() {
    this.router.navigate(['/feed']);
  }
}
