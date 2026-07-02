import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { RouterLink } from "@angular/router";
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from "primeng/password";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserService } from '../../../core/services/User/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from '../../../classes/user/user';
@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule, MessageModule, CheckboxModule, PasswordModule, InputTextModule, FloatLabelModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  readonly Heart = Heart

  private messageService = inject(MessageService);

  private router = inject(Router);

  public loginForm: FormGroup;

  loginBtnDisabled = signal(false);

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      rememberMe: new FormControl(false)
    });
  }

  async onLoginSubmit() {
    if (this.loginForm.valid) {
      this.loginBtnDisabled.set(true);
      const email: string = this.loginForm.get('email')!.value;
      const password: string = this.loginForm.get('password')!.value;
      //const rememberMe: boolean = this.loginForm.get('rememberMe')!.value;

      await this.userService.login(email, password).subscribe({
        next: async () => {
          this.loginBtnDisabled.set(false);

          try {
            await this.userService.me().pipe(
              map((rawUser: any) => {
                const user: User = this.userService.buildUser(rawUser);
                this.userService.setCurrentUser(user);
                this.userService.setTokenExpireTime(new Date(rawUser.exp * 1000));
                return true;
              }));
            this.router.navigate(['/feed']);
          } catch (err: unknown) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
          }

        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 401: {
              this.loginForm.get('password')?.setErrors({ wrongCredentials: true });
            } break;
            default: {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
              console.log(err);
            }
          }
          this.loginBtnDisabled.set(false);
        }
      });
    }
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
