import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonMenu,
  IonRouterOutlet,
  MenuController
} from '@ionic/angular/standalone';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonMenu,
    IonContent,
    IonRouterOutlet,
    RouterLink
  ]
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {}

  async closeMenu() {
    await this.menuController.close('main-menu');
  }

  async logout() {
    this.authService.logout();
    await this.menuController.close('main-menu');
    this.router.navigate(['/login']);
  }
}