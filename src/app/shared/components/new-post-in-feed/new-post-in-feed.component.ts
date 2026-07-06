import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { postMinLength } from '../../../core/directives/postMinLength/post-min-length.directive';
import { postMaxLength } from '../../../core/directives/postMaxLength/post-max-length.directive';
import { postMaxImages } from '../../../core/directives/postMaxImages/post-max-images.directive';
import { Post } from '../../../classes/post/post';
import { PostService } from '../../../core/services/Post/post.service';
import { User } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-post-in-feed',
  imports: [EditorModule, ButtonModule, MessageModule, ReactiveFormsModule, ToastModule],
  templateUrl: './new-post-in-feed.component.html',
  styleUrl: './new-post-in-feed.component.css',
  providers: [MessageService]
})
export class NewPostInFeedComponent {

  private messageService = inject(MessageService);

  showForm = signal<boolean>(false);

  showButton = signal<boolean>(true);

  formNewPost: FormGroup;
  formSubmitted: boolean = false;

  newPostEmitted = output<Post>();

  constructor(private formBuilder: FormBuilder, private postService: PostService, private userService: UserService) {
    this.formNewPost = this.formBuilder.group({
      content: ['', Validators.required]
    }, {
      validators: [postMinLength(3), postMaxLength(512), postMaxImages()]
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    let content: string = this.formNewPost.get('content')?.value;

    const source = this.getImageSource(content);

    content = content.replace(/<img[^>]*>/gi, "");

    if (this.formNewPost.valid) {
      //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      const newPost: Post = new Post("0", content, source[0]);

      this.postService.createPost(newPost).subscribe({
        next: rawPost => {
          const op: User = this.userService.buildUser(rawPost.op);
          const post: Post = this.postService.buildPost(rawPost);

          post.setOp(op);

          this.newPostEmitted.emit(post);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
        },
      });

      this.formNewPost.reset();
      this.formSubmitted = false;
    }
  }

  getImageSource(html: string): string[] {

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return Array.from(doc.querySelectorAll('img')).map(img => img.src);
  }

  showPostForm() {
    this.showButton.set(false);
    setTimeout(() => {
      this.showForm.set(true)
    }, 1000);
  }

  isInvalid(controlName: string) {
    const control = this.formNewPost.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  isDirty(field: string): boolean {
    const control = this.formNewPost.get(field);
    return !!control?.dirty;
  }
}
