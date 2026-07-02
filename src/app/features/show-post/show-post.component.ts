import { Component, inject, OnInit, signal } from '@angular/core';
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

  public location = inject(Location);

  constructor(private userService: UserService, private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.postService.getPost(id!).subscribe({
      next: (rawPost: any) => {
        const op: User = this.userService.buildUser(rawPost.op);
        const post: Post = this.postService.buildPost(rawPost);

        post.setOp(op);
        this.post.set(post);
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

  goBack() {
    this.location.back();
  }

}
