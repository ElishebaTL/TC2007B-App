import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

import {
  AppNotification,
  ParentUser,
  Student
} from '../../../core/models/school.models';

import { SchoolDataService } from '../../../core/services/school-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class DashboardPage implements OnInit {
  parent?: ParentUser;
  students: Student[] = [];
  notifications: AppNotification[] = [];

  pendingReportCards = 0;
  unreadNotifications = 0;

  constructor(private schoolDataService: SchoolDataService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.schoolDataService.getCurrentParent().subscribe({
      next: (parent) => {
        this.parent = parent;
      },
      error: (error) => {
        console.error('Error al cargar padre de familia:', error);
      }
    });

    this.schoolDataService.getStudentsByCurrentParent().subscribe({
      next: (students) => {
        this.students = students;
        this.pendingReportCards = students.reduce(
          (total, student) => total + student.pendingReportCards,
          0
        );
      },
      error: (error) => {
        console.error('Error al cargar hijos:', error);
      }
    });

    this.schoolDataService.getNotificationsByCurrentParent().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.unreadNotifications = notifications.filter(
          notification => !notification.read
        ).length;
      },
      error: (error) => {
        console.error('Error al cargar notificaciones:', error);
      }
    });
  }
}