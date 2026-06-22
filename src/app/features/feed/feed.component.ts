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
@Component({
  selector: 'app-feed',
  imports: [ReactiveFormsModule, FormsModule, SidebarComponent, PostComponent, NewPostInFeedComponent, DividerModule, CardModule, SelectButtonModule, DatePickerModule, FloatLabelModule, AutoCompleteModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {

  public posts = signal<Post[]>([]);

  today: Date;

  feedOptions: any = orders;

  formFilter: FormGroup;
  formSubmitted: boolean = false;


  visible: boolean = true;

  public items: any[];

  constructor(private formBuilder: FormBuilder, private postService: PostService, private userService: UserService) {
    this.formFilter = this.formBuilder.group({
      createdAtRange: [''],
      createdByUser: [],
    });


    this.today = new Date();
    this.items = [];
  }

  ngOnInit() {
    const filters: PostFilter = new PostFilter();

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
        console.log(err);
      }
    });

    this.formFilter.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => this.formFilter.valid),
      )
      .subscribe(formValues => {
        this.onSubmit();
      });
  }

  addNewPost(post: Post) {
    this.posts().push(post);
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

  onSubmit() {
    const createdAtRange: Array<any> = this.formFilter.get('createdAtRange')?.value;
    if (Array.isArray(createdAtRange) && createdAtRange.filter((date) => date == null).length == 1) return;

    const createdByUser: any = this.formFilter.get('createdByUser')?.value;
    console.log(createdByUser);

    this.formSubmitted = true;
    if (this.formFilter.valid) {
      //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      this.formSubmitted = false;
    }
  }

  isInvalid(controlName: string) {
    const control = this.formFilter.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
