import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

import { Student } from '../../../core/models/school.models';
import { SchoolDataService } from '../../../core/services/school-data.service';

@Component({
  selector: 'app-my-children',
  templateUrl: './my-children.page.html',
  styleUrls: ['./my-children.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class MyChildrenPage implements OnInit {
  students: Student[] = [];

  constructor(private schoolDataService: SchoolDataService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.schoolDataService.getStudentsByCurrentParent().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
      }
    });
  }
}