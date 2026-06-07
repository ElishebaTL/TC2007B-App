import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.page.html',
  styleUrls: ['./report-cards.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class ReportCardsPage {
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
          average: '8.3',
          status: 'Firmada'
        },
        {
          id: '2',
          name: 'Segundo Trimestre',
          period: 'Abril - Junio 2026',
          average: '8.4',
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
          average: '7.8',
          status: 'Firmada'
        },
        {
          id: '2',
          name: 'Segundo Trimestre',
          period: 'Abril - Junio 2026',
          average: '7.9',
          status: 'Sin firmar'
        }
      ]
    }
  ];

  selectedStudent: any = null;

  constructor(private route: ActivatedRoute) {
    const studentId = this.route.snapshot.paramMap.get('studentId');

    if (studentId) {
      this.selectedStudent = this.students.find(student => student.id === studentId) || null;
    }
  }
}