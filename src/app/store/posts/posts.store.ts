import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { AuthUser } from '@core/models';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  commentCount: number;
  createdAt: number;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'posts_data';

function loadFromStorage(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_POSTS;
  } catch {
    return MOCK_POSTS;
  }
}

function saveToStorage(posts: Post[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: '1',
    authorName: 'Ana García',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
    content: '¡Primer post de la red social! Muy emocionada de estar acá 🎉',
    likes: ['2'],
    commentCount: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'p2',
    authorId: '2',
    authorName: 'Carlos López',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos',
    content: 'Angular 21 con Signals Store es una maravilla. El boilerplate desapareció.',
    likes: ['1'],
    commentCount: 0,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'p3',
    authorId: '1',
    authorName: 'Ana García',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
    content:
      'Tailwind v4 con @utility es un cambio de paradigma. Adiós a los archivos SCSS gigantes.',
    likes: [],
    commentCount: 2,
    createdAt: Date.now() - 1000 * 60 * 10,
  },
];

const initialState: PostsState = {
  posts: loadFromStorage(),
  loading: false,
  error: null,
};

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState<PostsState>(initialState),
  withComputed((store) => ({
    sortedPosts: computed(() => [...store.posts()].sort((a, b) => b.createdAt - a.createdAt)),
    totalPosts: computed(() => store.posts().length),
  })),
  withMethods((store) => ({
    addPost(content: string, author: AuthUser, imageUrl?: string): void {
      const newPost: Post = {
        id: crypto.randomUUID(),
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar,
        content: content.trim(),
        imageUrl,
        likes: [],
        commentCount: 0,
        createdAt: Date.now(),
      };

      const updated = [newPost, ...store.posts()];
      saveToStorage(updated);
      patchState(store, { posts: updated });
    },

    toggleLike(postId: string, userId: string): void {
      const updated = store.posts().map((post) => {
        if (post.id !== postId) return post;
        const hasLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: hasLiked ? post.likes.filter((id) => id !== userId) : [...post.likes, userId],
        };
      });

      saveToStorage(updated);
      patchState(store, { posts: updated });
    },

    incrementCommentCount(postId: string): void {
      const updated = store
        .posts()
        .map((post) =>
          post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post,
        );

      saveToStorage(updated);
      patchState(store, { posts: updated });
    },

    deletePost(postId: string, userId: string): void {
      const post = store.posts().find((p) => p.id === postId);
      if (!post || post.authorId !== userId) return;

      const updated = store.posts().filter((p) => p.id !== postId);
      saveToStorage(updated);
      patchState(store, { posts: updated });
    },
  })),
);
