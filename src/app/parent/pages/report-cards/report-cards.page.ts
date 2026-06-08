import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-report-cards',
  templateUrl: './report-cards.page.html',
  styleUrls: ['./report-cards.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class ReportCardsPage implements OnInit {
  selectedStudent?: Student;
  reportCards: ReportCard[] = [];

  allReportCardsData: {
    student: Student;
    reportCards: ReportCard[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private schoolDataService: SchoolDataService
  ) {}

  ngOnInit() {
    const studentId = this.route.snapshot.paramMap.get('studentId');

    if (studentId) {
      this.loadReportCardsByStudent(studentId);
    } else {
      this.loadAllReportCards();
    }
  }

  loadReportCardsByStudent(studentId: string) {
    this.schoolDataService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.selectedStudent = student;
      },
      error: (error) => {
        console.error('Error al cargar estudiante:', error);
      }
    });

    this.schoolDataService.getReportCardsByStudent(studentId).subscribe({
      next: (reportCards) => {
        this.reportCards = reportCards;
      },
      error: (error) => {
        console.error('Error al cargar boletas:', error);
      }
    });
  }

  loadAllReportCards() {
    this.schoolDataService.getAllReportCardsByCurrentParent().subscribe({
      next: (data) => {
        this.allReportCardsData = data;
      },
      error: (error) => {
        console.error('Error al cargar todas las boletas:', error);
      }
    });
  }
}