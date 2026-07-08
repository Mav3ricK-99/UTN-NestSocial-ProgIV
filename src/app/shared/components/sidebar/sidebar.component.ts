import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'
import { BadgeModule } from 'primeng/badge'
import { SplitterModule } from 'primeng/splitter'
import { DividerModule } from 'primeng/divider';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { TabsModule } from 'primeng/tabs';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../../core/services/User/user.service';
import { Router } from '@angular/router';
import { ClosingSessionComponent } from '../closing-session/closing-session.component';
import { User, UserRole } from '../../../classes/user/user';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-sidebar',
  imports: [MenuModule, TabsModule, LucideAngularModule, AvatarModule, DividerModule, ButtonModule, CardModule, BadgeModule, SplitterModule, RouterLink, TooltipModule, ClosingSessionComponent, SkeletonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  readonly Heart = Heart
  items: MenuItem[] | undefined;

  private router = inject(Router);

  currentTime = signal(Date.now());

  timeLeft = signal('');

  modalShown: boolean = false;

  currentUser = signal<User | null>(null);

  constructor(private userService: UserService) {
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
            command: () => {
              this.router.navigate(['/profile', this.currentUser()!.getUserName()]);
            }
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
            linkClass: '!text-red-500 dark:!text-red-400',
            command: () => {
              this.logOut();
            }
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

    setInterval(() => {
      this.currentTime.set(Date.now());
    }, 60000);

    effect(() => {

      const exp = this.userService.expToken();

      if (!exp) {
        return;
      }
      const msDiff = exp.getTime() - this.currentTime();

      this.timeLeft.set(`Quedan ${Math.floor((msDiff / 1000) / 60)} minutos`);

      if (msDiff < 300000 && !this.modalShown) {
        this.modalShown = true;
      }
    });
  }

  ngOnInit() {
    this.currentUser.set(this.userService.loggedInUser());

    if (this.currentUser() && this.currentUser()!.getRole() === UserRole.ADMIN) {
      this.items![1].items?.splice(1, 0, {
        label: 'Dashboard',
        icon: 'pi pi-users',
        command: () => {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  copyUsername() {
    navigator.clipboard.writeText(this.currentUser()!.getUserName());
  }

  logOut() {
    this.userService.logOut().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.userService.setCurrentUser(null);
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
