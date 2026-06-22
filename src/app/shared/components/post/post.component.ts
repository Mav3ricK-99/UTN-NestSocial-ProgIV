import { Component, input, signal, Input, output, inject } from '@angular/core';
import { Post } from '../../../classes/post/post';
import { LucideAngularModule, Heart, Ellipsis, MessageCircle, Repeat } from 'lucide-angular';
import { PostService } from '../../../core/services/Post/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-post',
  imports: [LucideAngularModule, ToastModule],
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

  post = input.required<Post>();

  likeGiven = output<Post>();

  public likeBtnDisabled: boolean = false;

  inAside = input<boolean>(false);
  isDummyPost = input<boolean>(false);

  showPrompter: boolean = true;

  displayedText = signal('');
  imageLoaded = signal(false);

  constructor(private postService: PostService) { }

  ngOnInit() {
    if (this.isDummyPost()) {
      this.writeDummyPost();
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
