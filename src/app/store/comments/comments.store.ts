import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { AuthUser } from '@core/models';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: number;
}

interface CommentsState {
  comments: Comment[];
}

const STORAGE_KEY = 'comments_data';

function loadFromStorage(): Comment[] {
  try {
    if (typeof localStorage === 'undefined') return MOCK_COMMENTS;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_COMMENTS;
  } catch {
    return MOCK_COMMENTS;
  }
}

function saveToStorage(comments: Comment[]) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch {}
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    authorId: '2',
    authorName: 'Carlos López',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos',
    content: '¡Bienvenida! Este lugar va a ser genial.',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'c2',
    postId: 'p3',
    authorId: '2',
    authorName: 'Carlos López',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos',
    content: 'Totalmente de acuerdo. El DX mejoró muchísimo.',
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: 'c3',
    postId: 'p3',
    authorId: '1',
    authorName: 'Ana García',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
    content: 'Y sin romper nada del CSS existente, increíble.',
    createdAt: Date.now() - 1000 * 60 * 2,
  },
];

const initialState: CommentsState = {
  comments: loadFromStorage(),
};

export const CommentsStore = signalStore(
  { providedIn: 'root' },
  withState<CommentsState>(initialState),
  withComputed((store) => ({
    commentsByPost: computed(() => {
      const map = new Map<string, Comment[]>();
      for (const comment of store.comments()) {
        const list = map.get(comment.postId) ?? [];
        map.set(comment.postId, [...list, comment]);
      }
      return map;
    }),
  })),
  withMethods((store) => ({
    getCommentsForPost(postId: string): Comment[] {
      return store
        .comments()
        .filter((c) => c.postId === postId)
        .sort((a, b) => a.createdAt - b.createdAt);
    },

    addComment(postId: string, content: string, author: AuthUser): void {
      const newComment: Comment = {
        id: crypto.randomUUID(),
        postId,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar,
        content: content.trim(),
        createdAt: Date.now(),
      };

      const updated = [...store.comments(), newComment];
      saveToStorage(updated);
      patchState(store, { comments: updated });
    },

    deleteComment(commentId: string, userId: string): void {
      const comment = store.comments().find((c) => c.id === commentId);
      if (!comment || comment.authorId !== userId) return;

      const updated = store.comments().filter((c) => c.id !== commentId);
      saveToStorage(updated);
      patchState(store, { comments: updated });
    },
  })),
);
