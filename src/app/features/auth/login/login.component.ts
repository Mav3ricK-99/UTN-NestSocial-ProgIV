import { Component } from '@angular/core';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly Heart = Heart
}
