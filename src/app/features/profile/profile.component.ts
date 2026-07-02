import { Component, inject, Input, input, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { User } from '../../classes/user/user';
import { UserService } from '../../core/services/User/user.service';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../core/services/Post/post.service';
import { Post } from '../../classes/post/post';
import { PostComponent } from '../../shared/components/post/post.component';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-profile',
  imports: [SidebarComponent, PostComponent, AvatarModule, TabsModule, DividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  private route = inject(ActivatedRoute);

  user = signal<User | null>(null);
  posts = signal<Post[] | null>(null);

  @Input() username!: string;

  constructor(private userService: UserService, private postService: PostService) { }

  ngOnInit() {

    this.userService.getUserByUsername(this.username).subscribe({
      next: rawUser => {
        const user: User = this.userService.buildUser(rawUser);
        this.user.set(user);
      },
      error: err => {
        console.log(err);
      }
    });

    this.postService.getPostsFromUser(this.username).subscribe({
      next: (rawPosts: any) => {
        const posts = rawPosts.map((rawPost: any) => {
          const post: Post = this.postService.buildPost(rawPost);
          post.setOp(this.user()!);

          return post;
        });
        this.posts.set(posts);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  giveLike(postLiked: Post) {
    this.posts()!.forEach((post: Post) => {
      if (post.getId() == postLiked.getId()) {
        const liked: boolean = post.getLiked();
        post.setLiked(!liked);

        post.setCounts(postLiked);
      }
    });
  }
}
