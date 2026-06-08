import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  AppNotification,
  ParentUser,
  ReportCard,
  Student,
  TeacherComment
} from '../models/school.models';

import {
  MOCK_COMMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_PARENTS,
  MOCK_REPORT_CARDS,
  MOCK_STUDENTS
} from '../mock-data/mock-school-data';

// IMPORTS PARA FUTURA CONEXIÓN CON API
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolDataService {
  /*
    MOCK USER

    Este valor simula al padre que inició sesión.
    Para probar otro padre, cambia parent-001 por parent-002.

    Cuando exista login real, este id debe venir de:
    - token JWT
    - sesión activa
    - endpoint /auth/me
    - respuesta del login
  */
  private currentParentId = 'parent-001';

  // constructor(private http: HttpClient) {}

  getCurrentParent(): Observable<ParentUser | undefined> {
    const parent = MOCK_PARENTS.find(parent => parent.id === this.currentParentId);
    return of(parent);
  }

  getStudentsByCurrentParent(): Observable<Student[]> {
    const students = MOCK_STUDENTS.filter(
      student => student.parentId === this.currentParentId
    );

    return of(students);
  }

  getStudentById(studentId: string): Observable<Student | undefined> {
    const student = MOCK_STUDENTS.find(student => student.id === studentId);
    return of(student);
  }

  getAllReportCardsByCurrentParent(): Observable<{ student: Student; reportCards: ReportCard[] }[]> {
    const students = MOCK_STUDENTS.filter(
      student => student.parentId === this.currentParentId
    );

    const data = students.map(student => ({
      student,
      reportCards: MOCK_REPORT_CARDS.filter(reportCard => reportCard.studentId === student.id)
    }));

    return of(data);
  }

  getReportCardsByStudent(studentId: string): Observable<ReportCard[]> {
    const reportCards = MOCK_REPORT_CARDS.filter(
      reportCard => reportCard.studentId === studentId
    );

    return of(reportCards);
  }

  getReportCardDetail(studentId: string, reportCardId: string): Observable<ReportCard | undefined> {
    const reportCard = MOCK_REPORT_CARDS.find(
      reportCard =>
        reportCard.studentId === studentId &&
        reportCard.id === reportCardId
    );

    return of(reportCard);
  }

  getNotificationsByCurrentParent(): Observable<AppNotification[]> {
    const notifications = MOCK_NOTIFICATIONS.filter(
      notification => notification.parentId === this.currentParentId
    );

    return of(notifications);
  }

  markAllNotificationsAsRead(): Observable<AppNotification[]> {
    const notifications = MOCK_NOTIFICATIONS
      .filter(notification => notification.parentId === this.currentParentId)
      .map(notification => ({
        ...notification,
        read: true
      }));

    return of(notifications);
  }

  getCommentsByStudentAndReportCard(
    studentId: string,
    reportCardId: string
  ): Observable<TeacherComment[]> {
    const comments = MOCK_COMMENTS.filter(
      comment =>
        comment.studentId === studentId &&
        comment.reportCardId === reportCardId
    );

    return of(comments);
  }

  sendComment(
    studentId: string,
    reportCardId: string,
    message: string
  ): Observable<TeacherComment> {
    const newComment: TeacherComment = {
      id: crypto.randomUUID(),
      studentId,
      reportCardId,
      teacherName: 'Padre de familia',
      subjectName: 'Comentario general',
      message,
      date: new Date().toLocaleString('es-MX')
    };

    return of(newComment);
  }

  signReportCard(
    reportCardId: string,
    signatureImage: string
  ): Observable<{ success: boolean }> {
    console.log('Firma simulada para boleta:', reportCardId);
    console.log('Imagen de firma en base64:', signatureImage);

    return of({ success: true });
  }

  /*
    FUTURA CONEXIÓN CON BACKEND / API

    Cuando exista backend/base de datos:

    1. Descomentar HttpClient.
    2. Agregar provideHttpClient() en app.config.ts.
    3. Reemplazar los métodos mock por peticiones HTTP.

    Ejemplos:

    getCurrentParent(): Observable<ParentUser> {
      return this.http.get<ParentUser>(
        `${environment.apiUrl}/auth/me`
      );
    }

    getStudentsByCurrentParent(): Observable<Student[]> {
      return this.http.get<Student[]>(
        `${environment.apiUrl}/parents/me/students`
      );
    }

    getAllReportCardsByCurrentParent(): Observable<{ student: Student; reportCards: ReportCard[] }[]> {
      return this.http.get<{ student: Student; reportCards: ReportCard[] }[]>(
        `${environment.apiUrl}/parents/me/report-cards`
      );
    }

    getReportCardsByStudent(studentId: string): Observable<ReportCard[]> {
      return this.http.get<ReportCard[]>(
        `${environment.apiUrl}/students/${studentId}/report-cards`
      );
    }

    getReportCardDetail(studentId: string, reportCardId: string): Observable<ReportCard> {
      return this.http.get<ReportCard>(
        `${environment.apiUrl}/students/${studentId}/report-cards/${reportCardId}`
      );
    }

    getNotificationsByCurrentParent(): Observable<AppNotification[]> {
      return this.http.get<AppNotification[]>(
        `${environment.apiUrl}/parents/me/notifications`
      );
    }

    markAllNotificationsAsRead(): Observable<AppNotification[]> {
      return this.http.patch<AppNotification[]>(
        `${environment.apiUrl}/parents/me/notifications/read-all`,
        {}
      );
    }

    getCommentsByStudentAndReportCard(studentId: string, reportCardId: string): Observable<TeacherComment[]> {
      return this.http.get<TeacherComment[]>(
        `${environment.apiUrl}/students/${studentId}/report-cards/${reportCardId}/comments`
      );
    }

    sendComment(studentId: string, reportCardId: string, message: string): Observable<TeacherComment> {
      return this.http.post<TeacherComment>(
        `${environment.apiUrl}/students/${studentId}/report-cards/${reportCardId}/comments`,
        { message }
      );
    }

    signReportCard(reportCardId: string, signatureImage: string): Observable<{ success: boolean }> {
      return this.http.post<{ success: boolean }>(
        `${environment.apiUrl}/report-cards/${reportCardId}/signature`,
        { signatureImage }
      );
    }
  */
}