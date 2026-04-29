import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore, PostsStore, CommentsStore, UiStore } from '@store/index';
import { Post } from '@core/models';
import { IconComponent } from '@core/ui/components';
import { PostComposerComponent } from '@core/molecules';
import { PostCardComponent } from '@core/organism/index';

@Component({
  selector: 'app-feed-page',
  imports: [IconComponent, PostComposerComponent, PostCardComponent],
  templateUrl: './feed.page.html',
  styleUrl: './feed.page.css',
})
export class FeedPage {
  readonly authStore = inject(AuthStore);
  readonly postsStore = inject(PostsStore);
  readonly commentsStore = inject(CommentsStore);
  readonly uiStore = inject(UiStore);
  readonly router = inject(Router);

  readonly expandedPostId = signal<string | null>(null);

  get posts() {
    return this.postsStore.sortedPosts();
  }
  get user() {
    return this.authStore.currentUser();
  }

  onPostCreated(event: { content: string; imageUrl?: string }) {
    const user = this.user;
    if (!user) return;

    this.postsStore.addPost(event.content, user, event.imageUrl);
    this.uiStore.success('Post publicado', 'Tu publicación ya está en el feed.');
  }

  onToggleLike(postId: string) {
    const user = this.user;
    if (!user) return;
    this.postsStore.toggleLike(postId, user.id);
  }

  onToggleComments(postId: string) {
    this.expandedPostId.update((id) => (id === postId ? null : postId));
  }

  onCommentAdded(postId: string, content: string) {
    const user = this.user;
    if (!user) return;
    this.commentsStore.addComment(postId, content, user);
    this.postsStore.incrementCommentCount(postId);
  }

  onDeletePost(postId: string) {
    const user = this.user;
    if (!user) return;
    this.postsStore.deletePost(postId, user.id);
    this.uiStore.info('Post eliminado', 'se eliminó correctamente.');
  }

  onEditPost(event: { postId: string; content: string }) {
    this.postsStore.editPost(event.postId, event.content);
  }

  onLogout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  isLiked(post: Post): boolean {
    return post.likes.includes(this.user?.id ?? '');
  }

  isOwner(post: Post): boolean {
    return post.authorId === this.user?.id;
  }

  commentsForPost(postId: string) {
    return this.commentsStore.getCommentsForPost(postId);
  }
}
