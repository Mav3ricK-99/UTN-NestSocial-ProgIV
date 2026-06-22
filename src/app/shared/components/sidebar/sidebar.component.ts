import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'
import { DrawerModule } from 'primeng/drawer';
import { AccordionModule } from 'primeng/accordion'
import { BadgeModule } from 'primeng/badge'
import { SplitterModule } from 'primeng/splitter'
import { PanelModule } from 'primeng/panel'
import { DividerModule } from 'primeng/divider';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { TabsModule } from 'primeng/tabs';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [NgIf, MenuModule, TabsModule, LucideAngularModule, AvatarModule, DividerModule, PanelModule, ButtonModule, CardModule, DrawerModule, AccordionModule, BadgeModule, SplitterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly Heart = Heart
  items: MenuItem[] | undefined;


  constructor() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Perfil',
        items: [
          {
            label: 'Mis datos',
            icon: 'pi pi-user',
          },
          {
            label: 'Mensajes',
            icon: 'pi pi-inbox',
            badge: 'TODO',
            disabled: true
          },
          {
            label: 'Publicaciones',
            icon: 'pi pi-megaphone',
            badge: 'TODO',
            disabled: true
          },
          {
            label: 'Usuarios',
            icon: 'pi pi-users',
            badge: 'TODO',
            disabled: true
          },
          {
            label: 'Cerrar sesion',
            icon: 'pi pi-sign-out',
            linkClass: '!text-red-500 dark:!text-red-400'
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Buscar',
        items: [
          {
            label: 'Personas',
            icon: 'pi pi-users',
            disabled: true,
            badge: 'TODO',
          },
          {
            label: 'Destacados',
            icon: 'pi pi-crown',
            badge: 'TODO',
            disabled: true
          }
        ]
      }, {
        label: 'Seguidores',
      },
    ];
  }

}
