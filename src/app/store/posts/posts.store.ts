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
    if (typeof localStorage === 'undefined') return MOCK_POSTS;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_POSTS;
  } catch {
    return MOCK_POSTS;
  }
}

function saveToStorage(posts: Post[]) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: '1',
    authorName: 'Ana García',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
    content: 'Arrancando el día con toda la energía 💪',
    likes: ['2'],
    commentCount: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'p2',
    authorId: '2',
    authorName: 'Carlos López',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos',
    content: 'Nada como un buen café para ordenar la cabeza ☕',
    likes: ['1'],
    commentCount: 0,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'p3',
    authorId: '1',
    authorName: 'Ana García',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
    content: 'Pequeños logros también cuentan, no lo olviden ✨',
    likes: [],
    commentCount: 2,
    createdAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'p4',
    authorId: '3',
    authorName: 'Lucía Fernández',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lucia',
    content: 'Hoy se siente como un buen día para empezar algo nuevo',
    likes: [],
    commentCount: 0,
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: 'p5',
    authorId: '2',
    authorName: 'Carlos López',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos',
    content: 'A veces desconectar también es avanzar',
    likes: ['1'],
    commentCount: 0,
    createdAt: Date.now() - 1000 * 60 * 3,
  },
  {
    id: 'p6',
    authorId: '4',
    authorName: 'Martín Pérez',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=martin',
    content: 'Disfrutando los momentos simples 😊',
    likes: [],
    commentCount: 0,
    createdAt: Date.now() - 1000 * 60 * 2,
  },
  {
    id: 'p7',
    authorId: '3',
    authorName: 'Lucía Fernández',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lucia',
    content: '¿Soy yo o la semana pasó volando?',
    likes: [],
    commentCount: 0,
    createdAt: Date.now() - 1000 * 60,
  },
  {
    id: 'p8',
    authorId: '4',
    authorName: 'Martín Pérez',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=martin',
    content: 'Un paso a la vez, pero sin frenar',
    likes: [],
    commentCount: 0,
    createdAt: Date.now(),
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

    editPost(postId: string, content: string): void {
      const updated = store
        .posts()
        .map((post) => (post.id === postId ? { ...post, content: content.trim() } : post));

      patchState(store, () => ({
        posts: [...updated],
      }));

      saveToStorage(updated);
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
