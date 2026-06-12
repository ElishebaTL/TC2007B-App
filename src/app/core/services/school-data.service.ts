import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import {
  AppNotification,
  ParentUser,
  PerformanceLevel,
  ReportCard,
  Student,
  SubjectGrade,
  TeacherComment
} from '../models/school.models';

import {
  MOCK_COMMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_PARENTS,
  MOCK_REPORT_CARDS,
  MOCK_STUDENTS
} from '../mock-data/mock-school-data';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface ApiChild {
  alumno_id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  grupo: {
    grupo_id: number;
    nombre: string;
    grado: string;
    grupo_letra: string;
    ciclo_escolar: string;
  };
  foto_url: string | null;
  parentesco?: string;
}

interface ApiReportCardData {
  alumno: ApiChild;
  boleta: ApiSubjectEntry[];
  firmas: ApiSignatureSlot[];
}

interface ApiSubjectEntry {
  asignacion_id: number;
  materia: {
    materia_id: number;
    nombre: string;
  };
  docente: {
    docente_id: number;
    nombre: string;
    apellido: string;
  };
  calificaciones: ApiGrade[];
}

interface ApiGrade {
  periodo: string;
  nota: number | null;
  comentario: string | null;
  fecha_registro: string | null;
}

interface ApiSignatureSlot {
  periodo: string;
  firmada: boolean;
  firma_id: number | null;
  fecha_firma: string | null;
}

interface ApiAnnouncement {
  aviso_id: number;
  grupo?: {
    grupo_id: number;
    nombre: string;
  };
  autor?: {
    usuario_id: number;
    nombre: string;
    apellido: string;
    rol: string;
  };
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
}

interface ApiChat {
  chat_id: number;
  asignacion_id: number;
  alumno: {
    alumno_id: number;
    nombre: string;
    apellido: string;
  };
  docente: {
    docente_id: number;
    nombre: string;
    apellido: string;
  };
  materia: {
    materia_id: number;
    nombre: string;
  };
  ultimo_mensaje: string | null;
  ultima_fecha: string | null;
  no_leidos: number;
}

interface ApiMessage {
  mensaje_id: number;
  remitente_id: number;
  contenido: string;
  leido: boolean;
  fecha_envio: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolDataService {
  private currentParentId = 'parent-001';
  private readonly readNotificationsKey = 'grade_tracker_read_notifications';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCurrentParent(): Observable<ParentUser | undefined> {
    const user = this.authService.getUser();

    if (!user) {
      const mockParent = MOCK_PARENTS.find(
        parent => parent.id === this.currentParentId
      );

      return of(mockParent);
    }

    const parent: ParentUser = {
      id: String(user.id),
      fullName: `${user.nombre} ${user.apellido}`,
      email: user.email
    };

    return of(parent);
  }

  getStudentsByCurrentParent(): Observable<Student[]> {
    return this.http.get<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/hijos`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      switchMap((response) => {
        const rawData = this.unwrapResponse<any>(response);

        const children: ApiChild[] = Array.isArray(rawData)
          ? rawData
          : rawData?.hijos || rawData?.children || rawData?.alumnos || [];

        if (children.length === 0) {
          return of([]);
        }

        const requests = children.map((child) =>
          this.fetchReportCardsByStudentId(String(child.alumno_id)).pipe(
            map((reportCards) => {
              const averages = reportCards
                .map(reportCard => reportCard.average)
                .filter(average => average > 0);

              const generalAverage = averages.length > 0
                ? this.roundOneDecimal(
                    averages.reduce((total, average) => total + average, 0) / averages.length
                  )
                : 0;

              const pendingReportCards = reportCards.filter(
                reportCard => reportCard.status === 'Sin firmar'
              ).length;

              const student: Student = {
                id: String(child.alumno_id),
                parentId: 'current-tutor',
                fullName: child.nombre_completo || `${child.nombre} ${child.apellido}`,
                grade: child.grupo
                  ? `${child.grupo.grado}° ${child.grupo.grupo_letra}`
                  : 'Sin grupo',
                average: generalAverage,
                performanceLevel: this.getPerformanceLevel(generalAverage),
                pendingReportCards
              };

              return student;
            }),
            catchError((error) => {
              console.error('Error al calcular datos del estudiante:', error);

              const student: Student = {
                id: String(child.alumno_id),
                parentId: 'current-tutor',
                fullName: child.nombre_completo || `${child.nombre} ${child.apellido}`,
                grade: child.grupo
                  ? `${child.grupo.grado}° ${child.grupo.grupo_letra}`
                  : 'Sin grupo',
                average: 0,
                performanceLevel: 'Medio',
                pendingReportCards: 0
              };

              return of(student);
            })
          )
        );

        return forkJoin(requests);
      }),
      catchError((error) => {
        console.error('Error al cargar hijos desde API:', error);

        const mockStudents = MOCK_STUDENTS.filter(
          student => student.parentId === this.currentParentId
        );

        return of(mockStudents);
      })
    );
  }

  getStudentById(studentId: string): Observable<Student | undefined> {
    return this.getStudentsByCurrentParent().pipe(
      map((students) =>
        students.find(student => student.id === studentId)
      ),
      catchError((error) => {
        console.error('Error al buscar estudiante desde API:', error);

        const mockStudent = MOCK_STUDENTS.find(
          student => student.id === studentId
        );

        return of(mockStudent);
      })
    );
  }

  getAllReportCardsByCurrentParent(): Observable<
    { student: Student; reportCards: ReportCard[] }[]
  > {
    return this.getStudentsByCurrentParent().pipe(
      switchMap((students) => {
        if (students.length === 0) {
          return of([]);
        }

        const requests = students.map((student) =>
          this.getReportCardsByStudent(student.id).pipe(
            map((reportCards) => ({
              student,
              reportCards
            }))
          )
        );

        return forkJoin(requests);
      }),
      catchError((error) => {
        console.error('Error al cargar todas las boletas desde API:', error);

        const students = MOCK_STUDENTS.filter(
          student => student.parentId === this.currentParentId
        );

        const data = students.map(student => ({
          student,
          reportCards: MOCK_REPORT_CARDS.filter(
            reportCard => reportCard.studentId === student.id
          )
        }));

        return of(data);
      })
    );
  }

  getReportCardsByStudent(studentId: string): Observable<ReportCard[]> {
    return this.fetchReportCardsByStudentId(studentId).pipe(
      catchError((error) => {
        console.error('Error al cargar boletas desde API:', error);

        const reportCards = MOCK_REPORT_CARDS.filter(
          reportCard => reportCard.studentId === studentId
        );

        return of(reportCards);
      })
    );
  }

  getReportCardDetail(
    studentId: string,
    reportCardId: string
  ): Observable<ReportCard | undefined> {
    return this.getReportCardsByStudent(studentId).pipe(
      map((reportCards) =>
        reportCards.find(reportCard => reportCard.id === reportCardId)
      ),
      catchError((error) => {
        console.error('Error al cargar detalle de boleta desde API:', error);

        const reportCard = MOCK_REPORT_CARDS.find(
          reportCard =>
            reportCard.studentId === studentId &&
            reportCard.id === reportCardId
        );

        return of(reportCard);
      })
    );
  }

  downloadReportCardPdf(
    studentId: string,
    studentName: string
  ): Observable<boolean> {
    return this.http.get(
      `${environment.apiUrl}/movil/tutor/hijos/${studentId}/calificaciones/pdf`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      }
    ).pipe(
      map((pdfBlob: Blob) => {
        const fileName = `boleta-${studentName}`
          .toLowerCase()
          .replace(/\s+/g, '-')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${fileName}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        return true;
      }),
      catchError((error) => {
        console.error('Error al descargar PDF desde API:', error);
        return of(false);
      })
    );
  }

  getNotificationsByCurrentParent(): Observable<AppNotification[]> {
    return this.http.get<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/avisos`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => {
        const rawData = this.unwrapResponse<any>(response);

        const announcements: ApiAnnouncement[] = Array.isArray(rawData)
          ? rawData
          : rawData?.avisos || rawData?.announcements || [];

        const notifications = announcements.map((announcement): AppNotification => ({
          id: String(announcement.aviso_id),
          parentId: 'current-tutor',
          title: announcement.titulo || 'Aviso escolar',
          description: announcement.contenido || 'Sin descripción',
          date: this.formatApiDate(announcement.fecha_publicacion),
          type: 'info',
          icon: '📢',
          read: false
        }));

        return this.applyReadStatus(notifications);
      }),
      catchError((error) => {
        console.error('Error al cargar avisos desde API:', error);

        const notifications = MOCK_NOTIFICATIONS.filter(
          notification => notification.parentId === this.currentParentId
        );

        return of(this.applyReadStatus(notifications));
      })
    );
  }

  markAllNotificationsAsRead(): Observable<AppNotification[]> {
    return this.getNotificationsByCurrentParent().pipe(
      map((notifications) => {
        const currentReadIds = this.getReadNotificationIds();
        const newReadIds = notifications.map(notification => notification.id);

        this.saveReadNotificationIds([
          ...currentReadIds,
          ...newReadIds
        ]);

        return notifications.map(notification => ({
          ...notification,
          read: true
        }));
      }),
      catchError((error) => {
        console.error('Error al marcar avisos como leídos:', error);
        return of([]);
      })
    );
  }

  getCommentsByStudentAndReportCard(
    studentId: string,
    reportCardId: string
  ): Observable<TeacherComment[]> {
    return this.fetchChats().pipe(
      switchMap((chats) => {
        const studentChats = chats.filter(
          chat => String(chat.alumno.alumno_id) === String(studentId)
        );

        if (studentChats.length === 0) {
          return of([]);
        }

        const requests = studentChats.map((chat) =>
          this.fetchMessagesByChatId(chat.chat_id).pipe(
            map((messages) =>
              messages.map(message => ({
                message,
                chat
              }))
            )
          )
        );

        return forkJoin(requests).pipe(
          map((groups) => {
            const allMessages = groups.reduce(
              (
                accumulator: { message: ApiMessage; chat: ApiChat }[],
                group: { message: ApiMessage; chat: ApiChat }[]
              ) => {
                return accumulator.concat(group);
              },
              []
            );

            return allMessages
              .sort((a, b) => {
                const dateA = new Date(a.message.fecha_envio).getTime();
                const dateB = new Date(b.message.fecha_envio).getTime();

                return dateA - dateB;
              })
              .map(({ message, chat }) =>
                this.mapApiMessageToTeacherComment(
                  message,
                  chat,
                  studentId,
                  reportCardId
                )
              );
          })
        );
      }),
      catchError((error) => {
        console.error('Error al cargar chats desde API:', error);

        const comments = MOCK_COMMENTS.filter(
          comment =>
            comment.studentId === studentId &&
            comment.reportCardId === reportCardId
        );

        return of(comments);
      })
    );
  }

  sendComment(
    studentId: string,
    reportCardId: string,
    message: string
  ): Observable<TeacherComment> {
    const cleanedMessage = message.trim();

    if (!cleanedMessage) {
      const emptyComment: TeacherComment = {
        id: `comment-${Date.now()}`,
        studentId,
        reportCardId,
        teacherName: 'Padre de familia',
        subjectName: 'Comentario general',
        message: '',
        date: new Date().toLocaleString('es-MX')
      };

      return of(emptyComment);
    }

    return this.fetchChats().pipe(
      switchMap((chats) => {
        const existingChat = chats.find(
          chat => String(chat.alumno.alumno_id) === String(studentId)
        );

        if (existingChat) {
          return this.sendMessageToChat(
            existingChat,
            studentId,
            reportCardId,
            cleanedMessage
          );
        }

        return this.getReportCardDetail(studentId, reportCardId).pipe(
          switchMap((reportCard) => {
            const firstSubject = reportCard?.subjects?.[0];

            if (!firstSubject) {
              return of(
                this.createLocalComment(
                  studentId,
                  reportCardId,
                  cleanedMessage
                )
              );
            }

            const assignmentId = Number(firstSubject.id);
            const teacherName = firstSubject.teacherName;
            const subjectName = firstSubject.subjectName;

            if (!assignmentId) {
              return of(
                this.createLocalComment(
                  studentId,
                  reportCardId,
                  cleanedMessage,
                  teacherName,
                  subjectName
                )
              );
            }

            return this.startChat(
              Number(studentId),
              assignmentId,
              cleanedMessage
            ).pipe(
              map(() =>
                this.createLocalComment(
                  studentId,
                  reportCardId,
                  cleanedMessage,
                  teacherName,
                  subjectName
                )
              ),
              catchError((error) => {
                console.error('Error al crear chat desde API:', error);

                return of(
                  this.createLocalComment(
                    studentId,
                    reportCardId,
                    cleanedMessage,
                    teacherName,
                    subjectName
                  )
                );
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Error al enviar comentario desde API:', error);

        return of(
          this.createLocalComment(
            studentId,
            reportCardId,
            cleanedMessage
          )
        );
      })
    );
  }

  signReportCard(
    studentId: string,
    reportCardId: string,
    signatureImage?: string
  ): Observable<{ success: boolean }> {
    const periodo = this.reportCardIdToApiPeriod(reportCardId);

    console.log('Firma capturada en frontend:', signatureImage);

    return this.http.post<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/hijos/${studentId}/boletas/${encodeURIComponent(periodo)}/firma`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => {
        const data = this.unwrapResponse<any>(response);

        return {
          success: data?.success ?? true
        };
      }),
      catchError((error) => {
        console.error('Error al firmar boleta desde API:', error);

        return of({ success: false });
      })
    );
  }

  private fetchReportCardsByStudentId(studentId: string): Observable<ReportCard[]> {
    return this.http.get<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/hijos/${studentId}/calificaciones`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => {
        const rawData = this.unwrapResponse<any>(response);

        const data: ApiReportCardData = rawData?.alumno && rawData?.boleta
          ? rawData
          : rawData?.calificaciones || rawData?.reportCard || rawData;

        return this.mapApiReportCardsToAppReportCards(data);
      })
    );
  }

  private fetchChats(): Observable<ApiChat[]> {
    return this.http.get<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/chats`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => {
        const rawData = this.unwrapResponse<any>(response);

        const chats: ApiChat[] = Array.isArray(rawData)
          ? rawData
          : rawData?.chats || [];

        return chats;
      })
    );
  }

  private fetchMessagesByChatId(chatId: number): Observable<ApiMessage[]> {
    return this.http.get<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/chats/${chatId}/mensajes?page=1&limit=50`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => {
        const rawData = this.unwrapResponse<any>(response);

        const messages: ApiMessage[] = Array.isArray(rawData)
          ? rawData
          : rawData?.messages || rawData?.mensajes || [];

        return messages;
      })
    );
  }

  private sendMessageToChat(
    chat: ApiChat,
    studentId: string,
    reportCardId: string,
    message: string
  ): Observable<TeacherComment> {
    return this.http.post<ApiResponse<ApiMessage> | ApiMessage>(
      `${environment.apiUrl}/movil/tutor/chats/${chat.chat_id}/mensajes`,
      { contenido: message },
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => {
        const apiMessage = this.unwrapResponse<ApiMessage>(response);

        return this.mapApiMessageToTeacherComment(
          apiMessage,
          chat,
          studentId,
          reportCardId
        );
      })
    );
  }

  private startChat(
    studentId: number,
    assignmentId: number,
    message: string
  ): Observable<any> {
    return this.http.post<ApiResponse<any> | any>(
      `${environment.apiUrl}/movil/tutor/chats`,
      {
        alumno_id: studentId,
        asignacion_id: assignmentId,
        contenido: message
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((response) => this.unwrapResponse<any>(response))
    );
  }

  private mapApiReportCardsToAppReportCards(data: ApiReportCardData): ReportCard[] {
    if (!data || !data.boleta || !data.alumno) {
      return [];
    }

    const periods = this.extractPeriods(data);

    return periods
      .map((period) => {
        const subjects: SubjectGrade[] = data.boleta
          .map((entry): SubjectGrade | null => {
            const gradeInfo = entry.calificaciones.find(
              grade => grade.periodo === period
            );

            if (!gradeInfo || gradeInfo.nota === null) {
              return null;
            }

            const grade = Number(gradeInfo.nota);

            return {
              id: String(entry.asignacion_id),
              subjectName: entry.materia.nombre,
              teacherName: `${entry.docente.nombre} ${entry.docente.apellido}`,
              grade,
              performanceLevel: this.getPerformanceLevel(grade)
            };
          })
          .filter((subject): subject is SubjectGrade => subject !== null);

        if (subjects.length === 0) {
          return null;
        }

        const grades = subjects.map(subject => subject.grade);
        const average = this.calculateAverage(grades);

        const signature = data.firmas?.find(
          firma => firma.periodo === period
        );

        const reportCard: ReportCard = {
          id: this.periodToId(period),
          studentId: String(data.alumno.alumno_id),
          termName: this.periodToTitle(period),
          period: data.alumno.grupo?.ciclo_escolar || 'Periodo escolar',
          average,
          status: signature?.firmada ? 'Firmada' : 'Sin firmar',
          subjects
        };

        return reportCard;
      })
      .filter((reportCard): reportCard is ReportCard => reportCard !== null);
  }

  private mapApiMessageToTeacherComment(
    message: ApiMessage,
    chat: ApiChat,
    studentId: string,
    reportCardId: string
  ): TeacherComment {
    const currentUser = this.authService.getUser();
    const isCurrentUser = currentUser && Number(currentUser.id) === Number(message.remitente_id);

    return {
      id: String(message.mensaje_id),
      studentId,
      reportCardId,
      teacherName: isCurrentUser
        ? 'Padre de familia'
        : `${chat.docente.nombre} ${chat.docente.apellido}`,
      subjectName: chat.materia.nombre,
      message: message.contenido,
      date: this.formatApiDateTime(message.fecha_envio)
    };
  }

  private createLocalComment(
    studentId: string,
    reportCardId: string,
    message: string,
    teacherName = 'Padre de familia',
    subjectName = 'Comentario general'
  ): TeacherComment {
    return {
      id: `comment-${Date.now()}`,
      studentId,
      reportCardId,
      teacherName,
      subjectName,
      message,
      date: new Date().toLocaleString('es-MX')
    };
  }

  private extractPeriods(data: ApiReportCardData): string[] {
    const periodSet = new Set<string>();

    data.firmas?.forEach((signature) => {
      if (signature.periodo) {
        periodSet.add(signature.periodo);
      }
    });

    data.boleta?.forEach((entry) => {
      entry.calificaciones?.forEach((grade) => {
        if (grade.periodo && grade.nota !== null) {
          periodSet.add(grade.periodo);
        }
      });
    });

    return Array.from(periodSet).sort((a, b) => {
      return this.periodOrder(a) - this.periodOrder(b);
    });
  }

  private periodOrder(period: string): number {
    const normalized = period.toLowerCase();

    if (normalized.includes('primer') || normalized.includes('1')) {
      return 1;
    }

    if (normalized.includes('segundo') || normalized.includes('2')) {
      return 2;
    }

    if (normalized.includes('tercer') || normalized.includes('3')) {
      return 3;
    }

    return 99;
  }

  private calculateAverage(grades: number[]): number {
    if (grades.length === 0) {
      return 0;
    }

    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return this.roundOneDecimal(total / grades.length);
  }

  private roundOneDecimal(value: number): number {
    return Math.round(value * 10) / 10;
  }

  private getPerformanceLevel(value: number): PerformanceLevel {
    if (value >= 9) {
      return 'Alto';
    }

    if (value >= 7) {
      return 'Medio';
    }

    return 'Bajo';
  }

  private periodToId(period: string): string {
    return period
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private reportCardIdToApiPeriod(reportCardId: string): string {
    const normalized = reportCardId
      .toLowerCase()
      .replace(/-/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (normalized.includes('primer')) {
      return 'primer trimestre';
    }

    if (normalized.includes('segundo')) {
      return 'segundo trimestre';
    }

    if (normalized.includes('tercer')) {
      return 'tercer trimestre';
    }

    return normalized;
  }

  private periodToTitle(period: string): string {
    return period
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatApiDate(date: string): string {
    if (!date) {
      return 'Sin fecha';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  private formatApiDateTime(date: string): string {
    if (!date) {
      return 'Sin fecha';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getReadNotificationIds(): string[] {
    const stored = localStorage.getItem(this.readNotificationsKey);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  private saveReadNotificationIds(ids: string[]) {
    const uniqueIds = Array.from(new Set(ids));
    localStorage.setItem(this.readNotificationsKey, JSON.stringify(uniqueIds));
  }

  private applyReadStatus(notifications: AppNotification[]): AppNotification[] {
    const readIds = this.getReadNotificationIds();

    return notifications.map(notification => ({
      ...notification,
      read: readIds.includes(notification.id)
    }));
  }

  private unwrapResponse<T>(response: ApiResponse<T> | T): T {
    if (
      response &&
      typeof response === 'object' &&
      'data' in response
    ) {
      return (response as ApiResponse<T>).data;
    }

    return response as T;
  }
}