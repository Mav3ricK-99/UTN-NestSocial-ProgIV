import { Component, Input, OnChanges, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { User } from '../../classes/user/user';
import { UserService } from '../../core/services/User/user.service';
import { PostService } from '../../core/services/Post/post.service';
import { Post } from '../../classes/post/post';
import { PostComponent } from '../../shared/components/post/post.component';
import { DividerModule } from 'primeng/divider';

const MAX_PROFILE_POSTS = 3;

@Component({
  selector: 'app-profile',
  imports: [SidebarComponent, PostComponent, AvatarModule, TabsModule, DividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnChanges, OnDestroy {

  user = signal<User | null>(null);
  posts = signal<Post[]>([]);
  postsLoaded = signal<boolean>(false);
  loadError = signal<boolean>(false);

  @Input() username!: string;

  private loadSub = new Subscription();

  constructor(private userService: UserService, private postService: PostService) { }

  // Se ejecuta al crear el componente y cada vez que cambia :username en la ruta
  // (Angular reutiliza la instancia al ir de /profile/a a /profile/b).
  ngOnChanges() {
    this.loadSub.unsubscribe();
    this.loadSub = new Subscription();

    this.user.set(null);
    this.posts.set([]);
    this.postsLoaded.set(false);
    this.loadError.set(false);

    this.loadSub.add(this.userService.getUserByUsername(this.username).subscribe({
      next: rawUser => {
        const user: User = this.userService.buildUser(rawUser);
        this.user.set(user);
        this.getUserPosts();
      },
      error: err => {
        console.log(err);
        this.loadError.set(true);
      }
    }));
  }

  ngOnDestroy() {
    this.loadSub.unsubscribe();
  }

  getUserPosts() {
    this.loadSub.add(this.postService.getPostsFromUser(this.username).subscribe({
      next: (obj: any) => {
        const posts = obj.posts.slice(0, MAX_PROFILE_POSTS).map((rawPost: any) => {
          const post: Post = this.postService.buildPost(rawPost);
          post.setOp(this.user()!);

          return post;
        });
        this.posts.set(posts);
        this.postsLoaded.set(true);
      },
      error: (err: any) => {
        console.log(err);
        this.loadError.set(true);
      }
    }));
  }

  giveLike(postLiked: Post) {
    this.posts()!.forEach((post: Post) => {
      if (post.getId() == postLiked.getId()) {
        post.setLiked(postLiked.getLiked());
        post.setCounts(postLiked);
      }
    });
  }
}
