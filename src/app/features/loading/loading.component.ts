import { Component, inject, OnInit } from '@angular/core';
import { PostComponent } from '../../shared/components/post/post.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { UserService } from '../../core/services/User/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  imports: [PostComponent, SidebarComponent, SkeletonModule, DividerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent implements OnInit {

  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit() {
    this.userService.me().subscribe({
      next: () => this.router.navigate(['/feed']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
