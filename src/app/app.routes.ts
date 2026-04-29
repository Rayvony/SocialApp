import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { LayoutComponent } from '@core/organism/index';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.page').then((m) => m.FeedPage),
        title: 'Feed',
      },
      {
        path: 'profile/:id',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
        title: 'Perfil',
      },
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [authGuard],
    title: 'Iniciar sesión',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
