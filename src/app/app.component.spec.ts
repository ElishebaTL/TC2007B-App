import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonContent,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    RouterLink,
    RouterLinkActive
  ]
})
export class AppComponent {}