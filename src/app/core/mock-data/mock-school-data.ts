import {
  AppNotification,
  ParentUser,
  ReportCard,
  Student,
  TeacherComment
} from '../models/school.models';

/*
  MOCK DATA
  Datos temporales para probar la app sin backend.

  Esta estructura simula una escuela real:
  - n padres de familia
  - cada padre puede tener n hijos
  - cada hijo puede tener n boletas
  - cada boleta puede tener n materias

  Cuando exista API/base de datos, estos arreglos se reemplazan
  por peticiones HTTP desde SchoolDataService.
*/

export const MOCK_PARENTS: ParentUser[] = [
  {
    id: 'parent-001',
    fullName: 'Padre de familia prueba 1',
    email: 'padre1@escuela.com'
  },
  {
    id: 'parent-002',
    fullName: 'Padre de familia prueba 2',
    email: 'padre2@escuela.com'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'student-001',
    parentId: 'parent-001',
    fullName: 'Estudiante de prueba 1',
    grade: '6° Primaria',
    average: 9.4,
    performanceLevel: 'Alto',
    pendingReportCards: 1
  },
  {
    id: 'student-002',
    parentId: 'parent-001',
    fullName: 'Estudiante de prueba 2',
    grade: '4° Primaria',
    average: 8.3,
    performanceLevel: 'Medio',
    pendingReportCards: 1
  },
  {
    id: 'student-003',
    parentId: 'parent-001',
    fullName: 'Estudiante de prueba 3',
    grade: '2° Primaria',
    average: 7.8,
    performanceLevel: 'Medio',
    pendingReportCards: 1
  },
  {
    id: 'student-004',
    parentId: 'parent-002',
    fullName: 'Estudiante de prueba 4',
    grade: '5° Primaria',
    average: 9.1,
    performanceLevel: 'Alto',
    pendingReportCards: 0
  }
];

export const MOCK_REPORT_CARDS: ReportCard[] = [
  {
    id: 'report-001',
    studentId: 'student-001',
    termName: 'Primer Trimestre',
    period: 'Enero - Marzo 2026',
    average: 9.4,
    status: 'Firmada',
    subjects: [
      {
        id: 'subject-001',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 9.7,
        performanceLevel: 'Alto'
      },
      {
        id: 'subject-002',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 9.2,
        performanceLevel: 'Alto'
      },
      {
        id: 'subject-003',
        subjectName: 'Ciencias Naturales',
        teacherName: 'Profesor de prueba',
        grade: 9.5,
        performanceLevel: 'Alto'
      }
    ]
  },
  {
    id: 'report-002',
    studentId: 'student-001',
    termName: 'Segundo Trimestre',
    period: 'Abril - Junio 2026',
    average: 9.5,
    status: 'Sin firmar',
    subjects: [
      {
        id: 'subject-004',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 9.8,
        performanceLevel: 'Alto'
      },
      {
        id: 'subject-005',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 9.3,
        performanceLevel: 'Alto'
      },
      {
        id: 'subject-006',
        subjectName: 'Inglés',
        teacherName: 'Profesor de prueba',
        grade: 9.4,
        performanceLevel: 'Alto'
      }
    ]
  },
  {
    id: 'report-003',
    studentId: 'student-002',
    termName: 'Primer Trimestre',
    period: 'Enero - Marzo 2026',
    average: 8.3,
    status: 'Firmada',
    subjects: [
      {
        id: 'subject-007',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 8.5,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-008',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 8.1,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-009',
        subjectName: 'Ciencias Naturales',
        teacherName: 'Profesor de prueba',
        grade: 8.4,
        performanceLevel: 'Medio'
      }
    ]
  },
  {
    id: 'report-004',
    studentId: 'student-002',
    termName: 'Segundo Trimestre',
    period: 'Abril - Junio 2026',
    average: 8.4,
    status: 'Sin firmar',
    subjects: [
      {
        id: 'subject-010',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 8.2,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-011',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 8.5,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-012',
        subjectName: 'Inglés',
        teacherName: 'Profesor de prueba',
        grade: 8.4,
        performanceLevel: 'Medio'
      }
    ]
  },
  {
    id: 'report-005',
    studentId: 'student-003',
    termName: 'Primer Trimestre',
    period: 'Enero - Marzo 2026',
    average: 7.8,
    status: 'Firmada',
    subjects: [
      {
        id: 'subject-013',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 7.6,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-014',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 8.0,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-015',
        subjectName: 'Ciencias Naturales',
        teacherName: 'Profesor de prueba',
        grade: 7.8,
        performanceLevel: 'Medio'
      }
    ]
  },
  {
    id: 'report-006',
    studentId: 'student-003',
    termName: 'Segundo Trimestre',
    period: 'Abril - Junio 2026',
    average: 7.9,
    status: 'Sin firmar',
    subjects: [
      {
        id: 'subject-016',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 7.7,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-017',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 8.1,
        performanceLevel: 'Medio'
      },
      {
        id: 'subject-018',
        subjectName: 'Inglés',
        teacherName: 'Profesor de prueba',
        grade: 7.9,
        performanceLevel: 'Medio'
      }
    ]
  },
  {
    id: 'report-007',
    studentId: 'student-004',
    termName: 'Primer Trimestre',
    period: 'Enero - Marzo 2026',
    average: 9.1,
    status: 'Firmada',
    subjects: [
      {
        id: 'subject-019',
        subjectName: 'Matemáticas',
        teacherName: 'Profesor de prueba',
        grade: 9.2,
        performanceLevel: 'Alto'
      },
      {
        id: 'subject-020',
        subjectName: 'Español',
        teacherName: 'Profesora de prueba',
        grade: 9.0,
        performanceLevel: 'Alto'
      },
      {
        id: 'subject-021',
        subjectName: 'Ciencias Naturales',
        teacherName: 'Profesor de prueba',
        grade: 9.1,
        performanceLevel: 'Alto'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notification-001',
    parentId: 'parent-001',
    title: 'Boletas pendientes de firma',
    description: 'Tiene boletas pendientes por firmar.',
    date: '15 de Mayo, 2026',
    type: 'warning',
    icon: '⚠',
    read: false
  },
  {
    id: 'notification-002',
    parentId: 'parent-001',
    title: 'Nueva boleta disponible',
    description: 'Una nueva boleta ya está disponible para consulta.',
    date: '20 de Junio, 2026',
    type: 'info',
    icon: 'ⓘ',
    read: false
  },
  {
    id: 'notification-003',
    parentId: 'parent-002',
    title: 'Nueva boleta disponible',
    description: 'Una nueva boleta ya está disponible para consulta.',
    date: '20 de Junio, 2026',
    type: 'info',
    icon: 'ⓘ',
    read: false
  }
];

export const MOCK_COMMENTS: TeacherComment[] = [
  {
    id: 'comment-001',
    studentId: 'student-001',
    reportCardId: 'report-001',
    teacherName: 'Profesor de prueba',
    subjectName: 'Matemáticas',
    message: 'El estudiante muestra buen desempeño académico durante este periodo.',
    date: '16 de marzo de 2026, 10:30'
  },
  {
    id: 'comment-002',
    studentId: 'student-002',
    reportCardId: 'report-003',
    teacherName: 'Profesora de prueba',
    subjectName: 'Español',
    message: 'Se recomienda reforzar lectura y comprensión de textos.',
    date: '18 de marzo de 2026, 12:15'
  }
];