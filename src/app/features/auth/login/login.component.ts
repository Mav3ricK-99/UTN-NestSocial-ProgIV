import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { RouterLink } from "@angular/router";
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from "primeng/password";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule, MessageModule, CheckboxModule, PasswordModule, InputTextModule, FloatLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly Heart = Heart

  public loginForm: FormGroup;

  public disableSubmit: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      rememberMe: new FormControl(false)
    });
  }

  onLoginSubmit() {
    this.disableSubmit = true;
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);

    return !!(
      control?.invalid &&
      (control?.dirty || control?.touched)
    );
  }

  errorCheck(field: string, error: string): boolean {
    const control = this.loginForm.get(field);

    return !!control?.errors?.[error]!;
  }
}
