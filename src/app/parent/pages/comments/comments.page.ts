import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
  standalone: true,
  imports: [IonContent, IonMenuButton, RouterLink, FormsModule]
})
export class CommentsPage {
  newComment = '';

  sendComment() {
    if (!this.newComment.trim()) {
      return;
    }

    console.log('Comentario enviado:', this.newComment);
    this.newComment = '';
  }
}