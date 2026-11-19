import { Component, input, output, signal } from '@angular/core';
import { Comment } from '../../../classes/comment/comment';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CreateCommentComponent } from '../create-comment/create-comment.component';
import { TimeAgoPipe } from '../../pipes/timeAgo/time-ago.pipe';
import { TruncatePipe } from '../../pipes/truncate/truncate.pipe';
import { LazyImageDirective } from '../../directives/lazyImage/lazy-image.directive';

@Component({
  selector: 'app-comment',
  imports: [EditorModule, ButtonModule, CreateCommentComponent, TimeAgoPipe, TruncatePipe, LazyImageDirective],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {

  comment = input.required<Comment>();

  showNewComment = signal<boolean>(false);

  postId = signal<string>("");

  newCommentEmitted = output<Comment>();

  ngOnInit() {
    this.postId.set(this.comment().getPostId()!);
  }

  replyComment() {
    this.showNewComment.set(!this.showNewComment());
  }

  addNewReply(comment: Comment) {
    this.newCommentEmitted.emit(comment);
  }
}
