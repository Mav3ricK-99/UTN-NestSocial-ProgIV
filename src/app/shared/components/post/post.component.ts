import { Component, input, signal } from '@angular/core';
import { Post } from '../../../classes/post/post';
import { LucideAngularModule, Heart, Ellipsis, MessageCircle, Repeat } from 'lucide-angular';

@Component({
  selector: 'app-post',
  imports: [LucideAngularModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  readonly Heart = Heart
  readonly Ellipsis = Ellipsis
  readonly MessageCircle = MessageCircle
  readonly Repeat = Repeat

  post = input.required<Post>();

  showPrompter: boolean = true;

  displayedText = signal('');
  imageLoaded = signal(false);

  ngOnInit() {

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
