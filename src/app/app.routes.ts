import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'my-children',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/my-children/my-children.page').then(m => m.MyChildrenPage)
  },
  {
    path: 'report-cards',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/report-cards/report-cards.page').then(m => m.ReportCardsPage)
  },
  {
    path: 'report-cards/:studentId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/report-cards/report-cards.page').then(m => m.ReportCardsPage)
  },
  {
    path: 'report-card-detail/:studentId/:termId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/report-card-detail/report-card-detail.page').then(m => m.ReportCardDetailPage)
  },
  {
    path: 'comments/:studentId/:reportCardId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/comments/comments.page').then(m => m.CommentsPage)
  },
  {
    path: 'comments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/comments/comments.page').then(m => m.CommentsPage)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./parent/pages/notifications/notifications.page').then(m => m.NotificationsPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];