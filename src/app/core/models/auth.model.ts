export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google';
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
