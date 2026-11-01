import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Post } from '../../classes/post/post';
import { PostComponent } from '../../shared/components/post/post.component';
import { PostService } from '../../core/services/Post/post.service';
import { User } from '../../classes/user/user';
import { UserService } from '../../core/services/User/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-post',
  imports: [PostComponent, SidebarComponent, CardModule, ButtonModule],
  templateUrl: './show-post.component.html',
  styleUrl: './show-post.component.css',
})
export class ShowPostComponent implements OnInit {

  public post = signal<Post | null>(null);

  public loadError = signal<boolean>(false);

  public location = inject(Location);

  private destroyRef = inject(DestroyRef);

  constructor(private userService: UserService, private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Se suscribe a los params (no al snapshot) porque Angular reutiliza la instancia
    // al ir de /post/a a /post/b y ngOnInit no vuelve a ejecutarse.
    this.route.paramMap.pipe(
      tap(() => {
        this.post.set(null);
        this.loadError.set(false);
      }),
      switchMap(params => this.postService.getPost(params.get('id')!).pipe(
        catchError(err => {
          console.log(err.status);
          this.loadError.set(true);
          return EMPTY;
        })
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((rawPost: any) => {
      const op: User = this.userService.buildUser(rawPost.op);
      const post: Post = this.postService.buildPost(rawPost);

      post.setOp(op);
      this.post.set(post);
    });
  }

  goBack() {
    this.location.back();
  }

}
