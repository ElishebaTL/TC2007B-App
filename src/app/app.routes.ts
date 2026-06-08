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
    loadComponent: () => import('./auth/pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./parent/pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
  path: 'report-cards',
  loadComponent: () => import('./parent/pages/report-cards/report-cards.page').then(m => m.ReportCardsPage)
  },
  {
    path: 'report-cards/:studentId',
    loadComponent: () => import('./parent/pages/report-cards/report-cards.page').then(m => m.ReportCardsPage)
  },
  {
    path: 'report-card-detail/:studentId/:termId',
    loadComponent: () => import('./parent/pages/report-card-detail/report-card-detail.page').then(m => m.ReportCardDetailPage)
  },
  {
    path: 'comments/:studentId/:reportCardId',
    loadComponent: () => import('./parent/pages/comments/comments.page').then(m => m.CommentsPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./parent/pages/notifications/notifications.page').then(m => m.NotificationsPage)
  },
  {
    path: 'my-children',
    loadComponent: () => import('./parent/pages/my-children/my-children.page').then(m => m.MyChildrenPage)
  }
];