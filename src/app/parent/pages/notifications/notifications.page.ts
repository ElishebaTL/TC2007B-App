import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonMenuButton, RouterLink]
})
export class NotificationsPage {
  notifications = [
    {
      title: 'Boletas pendientes de firma',
      description: 'Tiene 3 boletas del Segundo Trimestre pendientes por firmar',
      date: '15 de Mayo, 2026',
      type: 'warning',
      icon: '⚠',
      read: false
    },
    {
      title: 'Nueva boleta disponible',
      description: 'La boleta del Segundo Trimestre de Andrés Jaramillo está disponible',
      date: '20 de Junio, 2026',
      type: 'info',
      icon: 'ⓘ',
      read: false
    },
    {
      title: 'Apoyo académico - Hector',
      description: 'El Prof. Pedro Martínez sugiere apoyo adicional en matemáticas para Hector',
      date: '18 de Marzo, 2026',
      type: 'warning',
      icon: '⚠',
      read: false
    },
    {
      title: 'Junta de padres de familia',
      description: 'Recordatorio: Junta informativa el viernes 17 de mayo a las 18:00 hrs en el auditorio',
      date: '12 de Mayo, 2026',
      type: 'info',
      icon: 'ⓘ',
      read: true
    },
    {
      title: 'Comentario del profesor',
      description: 'Prof. Pedro Martínez dejó un comentario sobre el desempeño de Andrés',
      date: '16 de Marzo, 2026',
      type: 'success',
      icon: '✓',
      read: true
    },
    {
      title: 'Recordatorio de tareas - Emiliano',
      description: 'Emiliano tiene tareas pendientes de Español para entregar mañana',
      date: '14 de Mayo, 2026',
      type: 'warning',
      icon: '⚠',
      read: true
    },
    {
      title: 'Pago colegiatura',
      description: 'El pago correspondiente al mes de junio vence el día 10',
      date: '1 de Junio, 2026',
      type: 'info',
      icon: 'ⓘ',
      read: true
    },
    {
      title: 'Festival de fin de año',
      description: 'Invitación al festival escolar el 28 de junio a las 16:00 hrs',
      date: '10 de Junio, 2026',
      type: 'info',
      icon: 'ⓘ',
      read: true
    }
  ];

  markAllAsRead() {
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      read: true
    }));
  }
}