import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../core/services/User/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-closing-session',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './closing-session.component.html',
  styleUrl: './closing-session.component.css',
})
export class ClosingSessionComponent {

  @Input() visible!: boolean;

  constructor(private userService: UserService, private router: Router) { }

  refreshSession() {
    this.visible = false;
    this.userService.refreshSession().subscribe({
      error: () => {
        this.userService.clearSession();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
