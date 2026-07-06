import { Component, inject, OnInit, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UserService } from '../../core/services/User/user.service';
import { User } from '../../classes/user/user';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { RegisterFormComponent } from '../../shared/components/register-form/register-form.component';
import { PostPerUserChartComponent } from '../../shared/components/post-per-user-chart/post-per-user-chart.component';
import { CommentsChartComponent } from '../../shared/components/comments-chart/comments-chart.component';
import { CommentsPerPostChartComponent } from '../../shared/components/comments-per-post-chart/comments-per-post-chart.component';
import { LikesPerDayChartComponent } from '../../shared/components/likes-per-day-chart/likes-per-day-chart.component';
import { ProfileVisitsChartComponent } from '../../shared/components/profile-visits-chart/profile-visits-chart.component';
import { LogginsPerUserChartComponent } from '../../shared/components/loggins-per-user-chart/loggins-per-user-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [TabsModule, SidebarComponent, ToastModule, DividerModule, UserCardComponent, RegisterFormComponent, PostPerUserChartComponent, CommentsChartComponent, CommentsPerPostChartComponent, LikesPerDayChartComponent, ProfileVisitsChartComponent, LogginsPerUserChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {

  private messageService = inject(MessageService);

  users = signal<User[] | null>(null);

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (rawUsers: any) => {
        const users = rawUsers.map((rawUser: any) => this.userService.buildUser(rawUser));
        this.users.set(users);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
      }
    });
  }

}
