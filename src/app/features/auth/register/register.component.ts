import { Component, signal } from '@angular/core';
import { LucideAngularModule, Heart, Plus } from 'lucide-angular';
import { RouterLink } from "@angular/router";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, RouterLink, InputTextModule, FloatLabelModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  readonly Heart = Heart
  readonly Plus = Plus

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
