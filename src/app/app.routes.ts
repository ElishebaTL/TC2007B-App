import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./parent/pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'report-cards',
    loadComponent: () => import('./parent/pages/report-cards/report-cards.page').then( m => m.ReportCardsPage)
  },
  {
    path: 'report-card-detail',
    loadComponent: () => import('./parent/pages/report-card-detail/report-card-detail.page').then( m => m.ReportCardDetailPage)
  },
  {
    path: 'comments',
    loadComponent: () => import('./parent/pages/comments/comments.page').then( m => m.CommentsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./parent/pages/profile/profile.page').then( m => m.ProfilePage)
  },
];
