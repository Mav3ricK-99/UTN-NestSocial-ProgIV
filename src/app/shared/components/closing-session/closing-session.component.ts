import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../core/services/User/user.service';
import { User } from '../../../classes/user/user';
import { map } from 'rxjs';

@Component({
  selector: 'app-closing-session',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './closing-session.component.html',
  styleUrl: './closing-session.component.css',
})
export class ClosingSessionComponent {

  @Input() visible!: boolean;

  constructor(private userService: UserService) { }

  refreshSession() {
    this.visible = false;
    this.userService.refreshToken().subscribe({
      next: () => {
        this.userService.isRefreshing = false;
        this.userService.me().subscribe({
          next: (rawUser: any) => {
            const user: User = this.userService.buildUser(rawUser);
            this.userService.setCurrentUser(user);
            this.userService.setTokenExpireTime(new Date(rawUser.exp * 1000));
            return true;
          }
        })
      }
    })
  }
}
