import { Component, input, signal, output, inject } from '@angular/core';
import { Post } from '../../../classes/post/post';
import { LucideAngularModule, Heart, Ellipsis, MessageCircle, Repeat, Trash2, UserRoundPlus, Eye, ArchiveRestore } from 'lucide-angular';
import { PostService } from '../../../core/services/Post/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { User } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';
import { Comment } from '../../../classes/comment/comment';
import { CommentComponent } from '../comment/comment.component';
import { CreateCommentComponent } from '../create-comment/create-comment.component';
import { PopoverModule } from 'primeng/popover';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-post',
  imports: [LucideAngularModule, ToastModule, PopoverModule, CommentComponent, CreateCommentComponent, SkeletonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  providers: [MessageService]
})
export class PostComponent {
  readonly Heart = Heart
  readonly Ellipsis = Ellipsis
  readonly MessageCircle = MessageCircle
  readonly Repeat = Repeat
  readonly Trash = Trash2
  readonly UserRoundPlus = UserRoundPlus
  readonly Eye = Eye
  readonly ArchiveRestore = ArchiveRestore

  private messageService = inject(MessageService);

  public router = inject(Router);

  public comments = signal<Comment[]>([])

  post = input<Post>();

  likeGiven = output<Post>();

  public likeBtnDisabled: boolean = false;

  inAside = input<boolean>(false);
  isDummyPost = input<boolean>(false);
  isLoading = input<boolean>(false);

  loadMoreComments = signal<boolean>(false);

  showPrompter: boolean = true;

  displayedText = signal('');
  imageLoaded = signal(false);

  constructor(public userService: UserService, private postService: PostService) { }

  ngOnInit() {
    if (this.isDummyPost()) {
      this.writeDummyPost();
    } else if(!this.isLoading()){
      this.loadComments();
    }
  }

  loadComments() {
    const postId = this.post()!.getId();

    let cursor: string | undefined = undefined;
    if (this.comments().length > 0) {
      cursor = this.comments()[this.comments().length - 1].getId();
    }

    this.postService.getComments(postId, cursor).subscribe({
      next: (obj: any) => {
        const comments = obj.comments.map((rawComment: any) => {
          const author: User = this.userService.buildUser(rawComment.author);
          const comment: Comment = this.postService.buildComment(rawComment);

          comment.setAuthor(author);
          comment.setPost(this.post()!);

          return comment;
        });
        if (cursor) {
          this.comments.set([...this.comments(), ...comments]);
        } else {
          this.comments.set(comments);
        }
        if (obj.hasMore) {
          this.loadMoreComments.set(true);
        } else {
          this.loadMoreComments.set(false);
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al obtener los comentarios. Intentelo nuevamente mas tarde.', life: 3000 });
      }
    });
  }

  giveLike() {
    if (this.likeBtnDisabled) return;
    this.likeBtnDisabled = true;

    const postId: string = this.post()!.getId();

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
    if (this.isDummyPost()!) return;
    this.router.navigate(["/post/" + this.post()!.getId()]);
  }

  addNewComment(comment: Comment) {
    this.comments().push(comment);
  }

  goToProfile() {
    if (this.isDummyPost()!) return;
    this.router.navigate(["/profile/" + this.post()!.op?.getUserName()]);
  }

  deletePost() {
    this.postService.deletePost(this.post()!.getId()).subscribe({
      next: () => {
        const deleted = this.post()!.getDeleted();
        if (deleted) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El post ha sido restaurado correctamente.', life: 3000 });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El post ha sido eliminado correctamente.', life: 3000 });
        }
        this.post()!.setDeleted(!deleted);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
        console.log(err);
      }
    });
  }

  writeDummyPost() {
    let index = 0;

    const interval = setInterval(() => {
      this.displayedText.update(
        value => value + this.post()!.content[index]
      );

      index++;
      if (index >= this.post()!.content.length) {
        clearInterval(interval);
        this.showPrompter = false;
      }
    }, 30);
  }
}
