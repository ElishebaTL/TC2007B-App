import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-report-card-detail',
  templateUrl: './report-card-detail.page.html',
  styleUrls: ['./report-card-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class ReportCardDetailPage implements AfterViewInit {
  @ViewChild('signatureCanvas') signatureCanvas?: ElementRef<HTMLCanvasElement>;

  showSignatureModal = false;
  isDrawing = false;
  signatureDone = false;

  private ctx?: CanvasRenderingContext2D;

  students = [
    {
      id: '1',
      name: 'Andrés Jaramillo Barón',
      grade: '6° Primaria',
      terms: [
        {
          id: '1',
          name: 'Primer Trimestre',
          period: 'Enero - Marzo 2026',
          average: '9.4',
          status: 'Firmada'
        },
        {
          id: '2',
          name: 'Segundo Trimestre',
          period: 'Abril - Junio 2026',
          average: '9.5',
          status: 'Sin firmar'
        }
      ]
    },
    {
      id: '2',
      name: 'Emiliano Jaramillo Barón',
      grade: '4° Primaria',
      terms: [
        {
          id: '1',
          name: 'Primer Trimestre',
          period: 'Enero - Marzo 2026',
          average: '8.1',
          status: 'Firmada'
        },
        {
          id: '2',
          name: 'Segundo Trimestre',
          period: 'Abril - Junio 2026',
          average: '8.3',
          status: 'Sin firmar'
        }
      ]
    },
    {
      id: '3',
      name: 'Hector Jaramillo Barón',
      grade: '2° Primaria',
      terms: [
        {
          id: '1',
          name: 'Primer Trimestre',
          period: 'Enero - Marzo 2026',
          average: '7.6',
          status: 'Firmada'
        },
        {
          id: '2',
          name: 'Segundo Trimestre',
          period: 'Abril - Junio 2026',
          average: '7.8',
          status: 'Sin firmar'
        }
      ]
    }
  ];

  student = this.students[0];
  term = this.students[0].terms[0];

  subjects = [
    {
      name: 'Matemáticas',
      teacher: 'Prof. Pedro Martínez',
      grade: '9.7'
    },
    {
      name: 'Español',
      teacher: 'Profa. Laura González',
      grade: '9.2'
    },
    {
      name: 'Ciencias Naturales',
      teacher: 'Prof. Ricardo Salazar',
      grade: '9.5'
    },
    {
      name: 'Historia de México',
      teacher: 'Profa. Elena Navarro',
      grade: '9.1'
    },
    {
      name: 'Inglés',
      teacher: 'Prof. Daniel Torres',
      grade: '9.6'
    },
    {
      name: 'Formación Cívica y Ética',
      teacher: 'Profa. Mariana Ruiz',
      grade: '9.3'
    },
    {
      name: 'Educación Física',
      teacher: 'Prof. Héctor Campos',
      grade: '9.4'
    },
    {
      name: 'Educación Artística',
      teacher: 'Profa. Sofía Mendoza',
      grade: '9.5'
    }
  ];

  constructor(private route: ActivatedRoute) {
    const studentId = this.route.snapshot.paramMap.get('studentId');
    const termId = this.route.snapshot.paramMap.get('termId');

    const foundStudent = this.students.find(student => student.id === studentId);

    if (foundStudent) {
      this.student = foundStudent;

      const foundTerm = foundStudent.terms.find(term => term.id === termId);

      if (foundTerm) {
        this.term = foundTerm;
      }
    }
  }

  ngAfterViewInit() {
    this.prepareCanvas();
  }

  openSignatureModal() {
    this.showSignatureModal = true;

    setTimeout(() => {
      this.prepareCanvas();
    }, 50);
  }

  closeSignatureModal() {
    this.showSignatureModal = false;
  }

  prepareCanvas() {
    const canvas = this.signatureCanvas?.nativeElement;

    if (!canvas) {
      return;
    }

    this.ctx = canvas.getContext('2d') || undefined;

    if (!this.ctx) {
      return;
    }

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#0f172a';
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    const point = this.getPoint(event);

    if (!this.ctx || !point) {
      return;
    }

    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  draw(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    if (!this.isDrawing || !this.ctx) {
      return;
    }

    const point = this.getPoint(event);

    if (!point) {
      return;
    }

    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearSignature() {
    const canvas = this.signatureCanvas?.nativeElement;

    if (!canvas || !this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.signatureDone = false;
  }

  confirmSignature() {
    this.signatureDone = true;
    this.showSignatureModal = false;

    console.log('Boleta firmada correctamente');
  }

  private getPoint(event: MouseEvent | TouchEvent) {
    const canvas = this.signatureCanvas?.nativeElement;

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height
      };
    }

    const touch = event.touches[0];

    if (!touch) {
      return null;
    }

    return {
      x: ((touch.clientX - rect.left) / rect.width) * canvas.width,
      y: ((touch.clientY - rect.top) / rect.height) * canvas.height
    };
  }
}