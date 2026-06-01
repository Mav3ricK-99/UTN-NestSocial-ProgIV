import { Component, signal } from '@angular/core';
import { LucideAngularModule, Heart, Plus } from 'lucide-angular';
import { RouterLink } from "@angular/router";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PostComponent } from '../../../shared/components/post/post.component';
import { Post } from '../../../classes/post/post';
@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, RouterLink, InputTextModule, FloatLabelModule, PostComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  readonly Heart = Heart
  readonly Plus = Plus

  demoPost: Post = {
    id: '1',
    authorName: 'NestSocial',
    username: 'official',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    content: `🚀 Bienvenido a NestSocial.
  Comparte ideas, conecta con personas y descubre contenido interesante.`,
    image: 'https://picsum.photos/640/480',
    likes: 124,
    comments: 18,
    reposts: 32,
    createdAt: new Date(),
    liked: true
  };

  public imagePreview = signal<string | null>(null);

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }
}
