import { Component, OnInit, signal } from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-feed',
  imports: [ReactiveFormsModule, FormsModule, SidebarComponent, PostComponent, NewPostInFeedComponent, DividerModule, CardModule, SelectButtonModule, DatePickerModule, FloatLabelModule, AutoCompleteModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {

  public posts = signal<Post[]>([]);

  public sidePosts = signal<Post[]>([]);

  today: Date;

  feedOptions: any = orders;

  formFilter: FormGroup;

  visible: boolean = true;

  public items: any[];

  constructor(private formBuilder: FormBuilder, private postService: PostService, private userService: UserService) {
    this.formFilter = this.formBuilder.group({
      orderBy: ['Recientes'],
      createdAtRange: [''],
      createdByUser: [],
    });


    this.today = new Date();
    this.items = [];
  }

  ngOnInit() {

    this.postService.getMostLiked().subscribe({
      next: rawPosts => {
        const posts = rawPosts.map((rawPost) => {
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

  callGetPosts(filters: PostFilter) {
    this.postService.getPosts(filters).subscribe({
      next: rawPosts => {
        const posts = rawPosts.map((rawPost) => {
          const op: User = this.userService.buildUser(rawPost.op);
          const post: Post = this.postService.buildPost(rawPost);

          post.setOp(op);

          return post;
        });
        this.posts.set(posts);
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
