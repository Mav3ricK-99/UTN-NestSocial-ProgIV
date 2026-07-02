import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { PostService } from '../../../core/services/Post/post.service';
import { Comment } from '../../../classes/comment/comment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { postMinLength } from '../../../core/directives/postMinLength/post-min-length.directive';
import { postMaxLength } from '../../../core/directives/postMaxLength/post-max-length.directive';
import { postMaxImages } from '../../../core/directives/postMaxImages/post-max-images.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { UserService } from '../../../core/services/User/user.service';

@Component({
  selector: 'app-create-comment',
  imports: [EditorModule, ButtonModule, CardModule, ReactiveFormsModule, MessageModule],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css',
})
export class CreateCommentComponent {

  postId = input.required<string>();

  comment = input<Comment>();

  formNewComment: FormGroup;
  formSubmitted: boolean = false;

  newCommentEmitted = output<Comment>();
  newReplyEmitted = output<Comment>();

  constructor(private formBuilder: FormBuilder, private userService: UserService, private postService: PostService) {
    this.formNewComment = this.formBuilder.group({
      content: ['', Validators.required]
    }, {
      validators: [postMinLength(3), postMaxLength(255), postMaxImages(0)]
    });
  }

  sendComment() {
    this.formSubmitted = true;
    let content: string = this.formNewComment.get('content')?.value;

    if (this.formNewComment.valid) {
      const comment: Comment = new Comment('0', content);

      if (this.comment()) {
        this.comment()!.setParentComment(comment);
      }

      this.postService.postComment(this.postId(), comment).subscribe({
        next: (rawComment: any) => {
          const comment: Comment = this.postService.buildComment(rawComment);
          this.formSubmitted = false;
          comment.setAuthor(this.userService.loggedInUser()!);
          if (!this.comment()) {
            this.newCommentEmitted.emit(comment);
          } else {
            this.newReplyEmitted.emit(comment);
          }
          this.formNewComment.reset();
        }, error: (error: HttpErrorResponse) => {
          this.formSubmitted = false;
        }
      });
    }
  }

  isInvalid(controlName: string) {
    const control = this.formNewComment.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  isDirty(field: string): boolean {
    const control = this.formNewComment.get(field);
    return !!control?.dirty;
  }
}
