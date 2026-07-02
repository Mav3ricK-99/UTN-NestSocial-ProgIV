import { Component, input, signal, output, inject } from '@angular/core';
import { Post } from '../../../classes/post/post';
import { LucideAngularModule, Heart, Ellipsis, MessageCircle, Repeat } from 'lucide-angular';
import { PostService } from '../../../core/services/Post/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';
import { Comment } from '../../../classes/comment/comment';
import { CommentComponent } from '../comment/comment.component';
import { CreateCommentComponent } from '../create-comment/create-comment.component';

@Component({
  selector: 'app-post',
  imports: [LucideAngularModule, ToastModule, RouterLink, CommentComponent, CreateCommentComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  providers: [MessageService]
})
export class PostComponent {
  readonly Heart = Heart
  readonly Ellipsis = Ellipsis
  readonly MessageCircle = MessageCircle
  readonly Repeat = Repeat

  private messageService = inject(MessageService);

  public router = inject(Router);

  public comments = signal<Comment[]>([])

  post = input.required<Post>();

  likeGiven = output<Post>();

  public likeBtnDisabled: boolean = false;

  inAside = input<boolean>(false);
  isDummyPost = input<boolean>(false);

  showPrompter: boolean = true;

  displayedText = signal('');
  imageLoaded = signal(false);

  constructor(private userService: UserService, private postService: PostService) { }

  ngOnInit() {
    if (this.isDummyPost()) {
      this.writeDummyPost();
    } else {
      this.postService.getComments(this.post().getId()).subscribe({
        next: (rawComments: any) => {
          const comments = rawComments.map((rawComment: any) => {
            const author: User = this.userService.buildUser(rawComment.author);
            const comment: Comment = this.postService.buildComment(rawComment);

            comment.setAuthor(author);
            comment.setPost(this.post());

            return comment;
          });
          this.comments.set(comments);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al obtener los comentarios. Intentelo nuevamente mas tarde.', life: 3000 });
        }
      });
    }
  }

  giveLike() {
    if (this.likeBtnDisabled) return;
    this.likeBtnDisabled = true;

    const postId: string = this.post().getId();

    this.postService.likeAPost(postId).subscribe({
      next: (rawPost: any) => {
        const post: Post = this.postService.buildPost(rawPost);
        this.likeGiven.emit(post);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
        console.log(err);
      }
    });

    setTimeout(() => {
      this.likeBtnDisabled = false;
    }, 1500);
  }

  showPost() {
    this.router.navigate(["/post/" + this.post().getId()]);
  }

  addNewComment(comment: Comment) {
    this.comments().unshift(comment);
  }

  writeDummyPost() {
    let index = 0;

    const interval = setInterval(() => {
      this.displayedText.update(
        value => value + this.post().content[index]
      );

      index++;
      if (index >= this.post().content.length) {
        clearInterval(interval);
        this.showPrompter = false;
      }
    }, 30);
  }
}
