import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

import {
  ReportCard,
  Student,
  TeacherComment
} from '../../../core/models/school.models';

import { SchoolDataService } from '../../../core/services/school-data.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink, FormsModule]
})
export class CommentsPage implements OnInit {
  student?: Student;
  reportCard?: ReportCard;
  comments: TeacherComment[] = [];

  newComment = '';

  private studentId = '';
  private reportCardId = '';

  constructor(
    private route: ActivatedRoute,
    private schoolDataService: SchoolDataService
  ) {}

  ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('studentId') || '';
    this.reportCardId = this.route.snapshot.paramMap.get('reportCardId') || '';

    this.loadCommentsData();
  }

  loadCommentsData() {
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
      },
      error: (error) => {
        console.error('Error al cargar boleta:', error);
      }
    });

    this.schoolDataService
      .getCommentsByStudentAndReportCard(this.studentId, this.reportCardId)
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
        error: (error) => {
          console.error('Error al cargar comentarios:', error);
        }
      });
  }

  sendComment() {
    if (!this.newComment.trim()) {
      return;
    }

    this.schoolDataService
      .sendComment(this.studentId, this.reportCardId, this.newComment)
      .subscribe({
        next: (comment) => {
          this.comments = [...this.comments, comment];
          this.newComment = '';
        },
        error: (error) => {
          console.error('Error al enviar comentario:', error);
        }
      });
  }
}