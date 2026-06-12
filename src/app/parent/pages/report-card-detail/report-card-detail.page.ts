import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

import {
  ReportCard,
  Student
} from '../../../core/models/school.models';

import { SchoolDataService } from '../../../core/services/school-data.service';

@Component({
  selector: 'app-report-card-detail',
  templateUrl: './report-card-detail.page.html',
  styleUrls: ['./report-card-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class ReportCardDetailPage implements OnInit, AfterViewInit {
  @ViewChild('signatureCanvas') signatureCanvas?: ElementRef<HTMLCanvasElement>;

  student?: Student;
  reportCard?: ReportCard;

  showSignatureModal = false;
  isDrawing = false;
  signatureDone = false;
  downloadingPdf = false;

  private ctx?: CanvasRenderingContext2D;
  private studentId = '';
  private reportCardId = '';

  constructor(
    private route: ActivatedRoute,
    private schoolDataService: SchoolDataService
  ) {}

  ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('studentId') || '';
    this.reportCardId = this.route.snapshot.paramMap.get('termId') || '';

    this.loadReportCardDetail();
  }

  ngAfterViewInit() {
    this.prepareCanvas();
  }

  loadReportCardDetail() {
    this.schoolDataService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Error al cargar estudiante:', error);
      }
    });

    this.schoolDataService.getReportCardDetail(this.studentId, this.reportCardId).subscribe({
      next: (reportCard) => {
        this.reportCard = reportCard;
        this.signatureDone = reportCard?.status === 'Firmada';
      },
      error: (error) => {
        console.error('Error al cargar detalle de boleta:', error);
      }
    });
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
    const canvas = this.signatureCanvas?.nativeElement;

    if (!canvas || !this.student || !this.reportCard) {
      return;
    }

    const signatureImage = canvas.toDataURL('image/png');

    this.schoolDataService
      .signReportCard(this.student.id, this.reportCard.id, signatureImage)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.signatureDone = true;

            this.reportCard = {
              ...this.reportCard!,
              status: 'Firmada'
            };

            this.showSignatureModal = false;
          }
        },
        error: (error) => {
          console.error('Error al firmar boleta:', error);
        }
      });
  }

  downloadReportCardPdf() {
    if (!this.student) {
      return;
    }

    this.downloadingPdf = true;

    this.schoolDataService
      .downloadReportCardPdf(this.student.id, this.student.fullName)
      .subscribe({
        next: () => {
          this.downloadingPdf = false;
        },
        error: (error) => {
          this.downloadingPdf = false;
          console.error('Error al descargar boleta PDF:', error);
        }
      });
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