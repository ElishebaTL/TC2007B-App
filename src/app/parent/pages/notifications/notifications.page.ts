import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

import { AppNotification } from '../../../core/models/school.models';
import { SchoolDataService } from '../../../core/services/school-data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class NotificationsPage implements OnInit {
  notifications: AppNotification[] = [];

  constructor(private schoolDataService: SchoolDataService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.schoolDataService.getNotificationsByCurrentParent().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error al cargar notificaciones:', error);
      }
    });
  }

  markAllAsRead() {
    this.schoolDataService.markAllNotificationsAsRead().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error al marcar notificaciones como leídas:', error);
      }
    });
  }

  getUnreadCount() {
    return this.notifications.filter(notification => !notification.read).length;
  }
}