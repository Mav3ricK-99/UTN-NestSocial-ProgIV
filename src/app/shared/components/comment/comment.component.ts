import { Component, input, OnInit, signal } from '@angular/core';
import { Comment } from '../../../classes/comment/comment';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { CreateCommentComponent } from '../create-comment/create-comment.component';

@Component({
  selector: 'app-comment',
  imports: [EditorModule, ButtonModule, CreateCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {

  comment = input.required<Comment>();

  showNewComment = signal<boolean>(false);

  postId = signal<string>("");

  ngOnInit() {
    this.postId.set(this.comment().getPost()?.getId()!);
  }

  replyComment() {
    this.showNewComment.set(!this.showNewComment());
  }
}
