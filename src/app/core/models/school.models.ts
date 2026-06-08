export type PerformanceLevel = 'Alto' | 'Medio' | 'Bajo';
export type ReportCardStatus = 'Firmada' | 'Sin firmar';
export type NotificationType = 'warning' | 'info' | 'success';

export interface ParentUser {
  id: string;
  fullName: string;
  email: string;
}

export interface Student {
  id: string;
  parentId: string;
  fullName: string;
  grade: string;
  average: number;
  performanceLevel: PerformanceLevel;
  pendingReportCards: number;
}

export interface SubjectGrade {
  id: string;
  subjectName: string;
  teacherName: string;
  grade: number;
  performanceLevel: PerformanceLevel;
}

export interface ReportCard {
  id: string;
  studentId: string;
  termName: string;
  period: string;
  average: number;
  status: ReportCardStatus;
  subjects: SubjectGrade[];
}

export interface AppNotification {
  id: string;
  parentId: string;
  title: string;
  description: string;
  date: string;
  type: NotificationType;
  icon: string;
  read: boolean;
}

export interface TeacherComment {
  id: string;
  studentId: string;
  reportCardId: string;
  teacherName: string;
  subjectName: string;
  message: string;
  date: string;
}