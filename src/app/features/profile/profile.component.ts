import { Component, effect, Input, viewChild, signal, ElementRef } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { User } from '../../classes/user/user';
import { UserService } from '../../core/services/User/user.service';
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

  user = signal<User | null>(null);
  posts = signal<Post[]>([]);

  public loadMorePost = signal<boolean>(false);

  public postLoaded = signal<boolean>(false);

  @Input() username!: string;

  loadMoreTrigger = viewChild<ElementRef>('loadMoreTrigger');

  private observer?: IntersectionObserver;

  constructor(private userService: UserService, private postService: PostService) {
    effect(() => {

      const trigger = this.loadMoreTrigger();

      if (!trigger || this.observer) {
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && this.loadMorePost() && this.postLoaded()) {
          const cursor = this.posts()[this.posts().length - 1].getId();
          this.getUserPosts(cursor);
        } else {
          this.postLoaded.set(true);
        }
      }, {
        threshold: 0.5,
      },
      );
      this.observer.observe(trigger.nativeElement);
    });
  }

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

    this.getUserPosts();
  }

  getUserPosts(cursor?: string) {
    this.postService.getPostsFromUser(this.username, cursor).subscribe({
      next: (obj: any) => {
        const posts = obj.posts.map((rawPost: any) => {
          const post: Post = this.postService.buildPost(rawPost);
          post.setOp(this.user()!);

          return post;
        });
        if (cursor) {
          this.posts.set([...this.posts(), ...posts]);
        } else {
          this.posts.set(posts);
        }

        if (!obj.hasMorePosts) {
          this.loadMorePost.set(false);
        }
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
