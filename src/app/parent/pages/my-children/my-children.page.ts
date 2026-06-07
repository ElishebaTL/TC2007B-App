import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-my-children',
  templateUrl: './my-children.page.html',
  styleUrls: ['./my-children.page.scss'],
  standalone: true,
  imports: [IonContent, IonMenuButton, RouterLink]
})
export class MyChildrenPage {}