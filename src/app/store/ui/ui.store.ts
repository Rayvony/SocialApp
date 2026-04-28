import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { ToastMessage } from '@core/services';

export type Theme = 'light' | 'dark' | 'system';

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
  toasts: ToastMessage[];
}

const STORAGE_KEY = 'ui_preferences';

function loadFromStorage(): Pick<UiState, 'theme' | 'sidebarOpen'> {
  try {
    if (typeof localStorage === 'undefined') return { theme: 'system', sidebarOpen: true };
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { theme: 'system', sidebarOpen: true };
  } catch {
    return { theme: 'system', sidebarOpen: true };
  }
}

function saveToStorage(state: Pick<UiState, 'theme' | 'sidebarOpen'>) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
}

const { theme, sidebarOpen } = loadFromStorage();

const initialState: UiState = {
  theme,
  sidebarOpen,
  toasts: [],
};

let toastIdCounter = 0;

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState<UiState>(initialState),
  withComputed((store) => ({
    isDark: computed(() => {
      const t = store.theme();
      if (t === 'dark') return true;
      if (t === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }),
    activeToasts: computed(() => store.toasts()),
  })),
  withMethods((store) => ({
    setTheme(theme: Theme): void {
      applyTheme(theme);
      saveToStorage({ theme, sidebarOpen: store.sidebarOpen() });
      patchState(store, { theme });
    },

    toggleTheme(): void {
      const next = store.isDark() ? 'light' : 'dark';
      applyTheme(next);
      saveToStorage({ theme: next, sidebarOpen: store.sidebarOpen() });
      patchState(store, { theme: next });
    },

    toggleSidebar(): void {
      const sidebarOpen = !store.sidebarOpen();
      saveToStorage({ theme: store.theme(), sidebarOpen });
      patchState(store, { sidebarOpen });
    },

    setSidebarOpen(open: boolean): void {
      saveToStorage({ theme: store.theme(), sidebarOpen: open });
      patchState(store, { sidebarOpen: open });
    },

    addToast(toast: Omit<ToastMessage, 'id'>): number {
      const id = ++toastIdCounter;
      const newToast: ToastMessage = { ...toast, id };
      patchState(store, { toasts: [...store.toasts(), newToast] });
      return id;
    },

    removeToast(id: number): void {
      patchState(store, {
        toasts: store.toasts().filter((t) => t.id !== id),
      });
    },

    success(summary: string, detail?: string, duration = 4000): void {
      this.addToast({ severity: 'success', summary, detail, duration });
    },
    info(summary: string, detail?: string, duration = 4000): void {
      this.addToast({ severity: 'info', summary, detail, duration });
    },
    warn(summary: string, detail?: string, duration = 5000): void {
      this.addToast({ severity: 'warn', summary, detail, duration });
    },
    danger(summary: string, detail?: string, duration = 6000): void {
      this.addToast({ severity: 'danger', summary, detail, duration });
    },
  })),
);
