import { Component, ElementRef, OnInit, signal, viewChild, effect } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PostComponent } from '../../shared/components/post/post.component';
import { DividerModule } from 'primeng/divider';
import { Post } from '../../classes/post/post';
import { NewPostInFeedComponent } from '../../shared/components/new-post-in-feed/new-post-in-feed.component';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { PostService } from '../../core/services/Post/post.service';
import { orders, PostFilter } from '../../classes/postFilter/post-filter';
import { UserService } from '../../core/services/User/user.service';
import { User } from '../../classes/user/user';
@Component({
  selector: 'app-feed',
  imports: [ReactiveFormsModule, FormsModule, SidebarComponent, PostComponent, NewPostInFeedComponent, DividerModule, CardModule, SelectButtonModule, DatePickerModule, FloatLabelModule, AutoCompleteModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {

  public posts = signal<Post[]>([]);

  public sidePosts = signal<Post[]>([]);

  public loadMorePost = signal<boolean>(false);

  public postLoaded = signal<boolean>(false);

  today: Date;

  feedOptions: any = orders;

  formFilter: FormGroup;

  loadMoreTrigger = viewChild<ElementRef>('loadMoreTrigger');

  private observer?: IntersectionObserver;

  visible: boolean = true;

  public items: any[];

  constructor(private formBuilder: FormBuilder, private postService: PostService, private userService: UserService) {
    this.formFilter = this.formBuilder.group({
      orderBy: ['Recientes'],
      createdAtRange: [''],
      createdByUser: [],
    });

    effect(() => {

      const trigger = this.loadMoreTrigger();

      if (!trigger || this.observer) {
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && this.loadMorePost() && this.postLoaded()) {
          const filters = new PostFilter(this.formFilter.value.createdAtRange[0], this.formFilter.value.createdAtRange[1], this.formFilter.value.orderBy, undefined, 5);
          const cursor = this.posts()[this.posts().length - 1].getId();
          this.callGetPosts(filters, cursor);
        } else {
          this.postLoaded.set(true);
        }
      }, {
        threshold: 0.5,
      },
      );
      this.observer.observe(trigger.nativeElement);
    });

    this.today = new Date();
    this.items = [];
  }

  ngOnInit() {
    this.postService.getMostLiked().subscribe({
      next: (obj: any) => {
        const posts = obj.posts.map((rawPost: any) => {
          const op: User = this.userService.buildUser(rawPost.op);
          const post: Post = this.postService.buildPost(rawPost);

          post.setOp(op);

          return post;
        });
        this.sidePosts.set(posts);
      },
      error: err => {
        console.log(err.status);
      }
    });

    const filters: PostFilter = new PostFilter();

    this.callGetPosts(filters);

    this.formFilter.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => this.formFilter.valid),
      )
      .subscribe(filterValues => {
        if (Array.isArray(filterValues.createdAtRange) && filterValues.createdAtRange.filter((date: any) => date == null).length == 1) return;
        const filters = new PostFilter(filterValues.createdAtRange[0], filterValues.createdAtRange[1], filterValues.orderBy, undefined, 5);

        this.callGetPosts(filters);
      });
  }

  addNewPost(post: Post) {
    this.posts().unshift(post);
  }

  callGetPosts(filters: PostFilter, cursor?: string) {
    this.postService.getPosts(filters, cursor).subscribe({
      next: (obj: any) => {
        const posts = obj.posts.map((rawPost: any) => {
          const op: User = this.userService.buildUser(rawPost.op);
          const post: Post = this.postService.buildPost(rawPost);

          post.setOp(op);

          return post;
        });

        if (cursor) {
          this.posts.set([...this.posts(), ...posts]);
        } else {
          this.posts.set(posts);
        }

        if(!obj.hasMorePosts) {
          this.loadMorePost.set(false);
        }
      },
      error: err => {
        console.log(err.status);
      }
    });
  }

  giveLike(postLiked: Post) {
    this.posts().forEach((post: Post) => {
      if (post.getId() == postLiked.getId()) {
        const liked: boolean = post.getLiked();
        post.setLiked(!liked);

        post.setCounts(postLiked);
      }
    });
  }

  search(event: AutoCompleteCompleteEvent) {
    this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
  }

}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
