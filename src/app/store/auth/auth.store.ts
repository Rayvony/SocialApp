import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { AuthUser, AuthState } from '@core/models';

const initialState: AuthState = {
  user: loadFromStorage(),
  loading: false,
  error: null,
};

function loadFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(user: AuthUser | null) {
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth_user');
  }
}

const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana@mail.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ana',
    provider: 'email',
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos@mail.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=carlos',
    provider: 'email',
  },
];

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.user()),
    currentUser: computed(() => store.user()),
  })),
  withMethods((store) => ({
    async loginWithEmail(email: string, password: string): Promise<void> {
      patchState(store, { loading: true, error: null });

      await delay(600); // simula latencia

      const found = MOCK_USERS.find((u) => u.email === email && u.password === password);

      if (!found) {
        patchState(store, {
          loading: false,
          error: 'Email o contraseña incorrectos',
        });
        return;
      }

      const { password: _, ...user } = found;
      saveToStorage(user);
      patchState(store, { user, loading: false, error: null });
    },

    async loginWithGoogle(): Promise<void> {
      patchState(store, { loading: true, error: null });

      await delay(800); // simula OAuth flow

      const user: AuthUser = {
        id: 'google-' + Math.random().toString(36).slice(2, 7),
        name: 'Usuario Google',
        email: 'google-user@gmail.com',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=google',
        provider: 'google',
      };

      saveToStorage(user);
      patchState(store, { user, loading: false, error: null });
    },

    logout(): void {
      saveToStorage(null);
      patchState(store, { user: null, error: null });
    },
  })),
);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
