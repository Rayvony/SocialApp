import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [authGuard],
    title: 'Iniciar sesión',
  },
  {
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed.page').then((m) => m.FeedPage),
    canActivate: [authGuard],
    title: 'Feed',
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    canActivate: [authGuard],
    title: 'Perfil',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
    title: 'Página no encontrada',
  },
];
