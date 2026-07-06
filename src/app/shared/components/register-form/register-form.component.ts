import { Component, signal, ElementRef, ViewChild, inject } from '@angular/core';
import { LucideAngularModule, Dices, Heart, Upload } from 'lucide-angular';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { passwordsMustMatch } from '../../../core/directives/passwordsMustMatch/passwords-must-match.directive';
import { UserRole } from "../../../classes/user/user";
import { passwordsMustBeSecure } from "../../../core/directives/passwordsMustBeSecure/passwords-must-be-secure.directive";
import { PasswordModule } from "primeng/password";
import { DividerModule } from 'primeng/divider';
import { fileTypeMustBeValid } from '../../../core/directives/fileTypeMustBeValid/file-type-must-be-valid.directive';
import { User } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { demoContents, demoNames, demoUsernames } from '../../../shared/dummyContent/dummy-content';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register-form',
  imports: [InputTextModule, FloatLabelModule, MessageModule, FormsModule, ReactiveFormsModule, PasswordModule, DividerModule, ToastModule, LucideAngularModule, SelectModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  readonly Dices = Dices;
  readonly Heart = Heart;
  readonly Upload = Upload;

  selectedFile: File | undefined;

  public router = inject(Router);

  private messageService = inject(MessageService);

  @ViewChild('avatarInput') avatarElement!: ElementRef<HTMLInputElement>;
  readonly meses = [
    { name: 'Enero', code: '1' },
    { name: 'Febrero', code: '2' },
    { name: 'Marzo', code: '3' },
    { name: 'Abril', code: '4' },
    { name: 'Mayo', code: '5' },
    { name: 'Junio', code: '6' },
    { name: 'Julio', code: '7' },
    { name: 'Agosto', code: '8' },
    { name: 'Septiembre', code: '9' },
    { name: 'Octubre', code: '10' },
    { name: 'Noviembre', code: '11' },
    { name: 'Diciembre', code: '12' }
  ];

  public registerForm: FormGroup;

  public currentYear = new Date().getFullYear();

  submitBtnDisabled = signal(false);

  public imagePreview = signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9._]+$')]),
      birthDay: new FormControl('', [Validators.required, Validators.min(1), Validators.max(31)]),
      birthMonth: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(12)]),
      birthYear: new FormControl('', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]),
      bio: new FormControl('', [Validators.maxLength(250)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      avatar: new FormControl(null, [Validators.required, fileTypeMustBeValid([
        'jpeg',
        'png',
        'webp',
        'jpg',
        'jfif'
      ])]),
    }, {
      validators: [passwordsMustMatch(), passwordsMustBeSecure()]
    });
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(this.selectedFile);
  }

  onRegisterSubmit() {

    if (this.selectedFile == undefined) return;
    if (this.registerForm.valid) {
      this.submitBtnDisabled.set(true);
      const email = this.registerForm.get('email')!!.value;
      const name = this.registerForm.get('name')!!.value;
      const surname = this.registerForm.get('surname')!!.value;
      const username = this.registerForm.get('username')!!.value;
      const birthDay = this.registerForm.get('birthDay')!!.value;
      const birthMonth = this.registerForm.get('birthMonth')!!.value;
      const birthYear = this.registerForm.get('birthYear')!!.value;
      const bio = this.registerForm.get('bio')!!.value;
      const password = this.registerForm.get('password')!!.value;
      const confirmPassword = this.registerForm.get('confirmPassword')!!.value;

      const userFullName: string = `${name} ${surname}`;
      const birthDate: Date = new Date();
      birthDate.setFullYear(birthYear);
      birthDate.setDate(birthDay);
      birthDate.setMonth((Number(birthMonth.code) - 1));

      const newUser: User = new User('0', userFullName, email, username, birthDate, bio, '', UserRole.USER, true, new Date());
      this.userService.createUser(newUser, password, confirmPassword, this.selectedFile).subscribe({
        next: () => {
          this.registerForm.reset();

          if (this.userService.isUserLoggedIn()) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          } else {
            this.router.navigate(['/auth/login']);
          }
        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 401: {
              this.registerForm.get('email')?.setErrors({ emailExists: true });
            } break;
            default: {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
              console.log(err);
            }
          }
          this.submitBtnDisabled.set(false);
        },
      });

    }
  }

  randomizeData() {
    this.registerForm.patchValue({
      username: demoUsernames[Math.floor(Math.random() * demoUsernames.length)],
      name: demoNames[Math.floor(Math.random() * demoNames.length)],
      surname: demoNames[Math.floor(Math.random() * demoNames.length)],
      email: 'federico1999g@gmail.com',
      birthDay: Math.floor(Math.random() * (28 - 1) + 1),
      birthMonth: this.meses[Math.floor(Math.random() * (12 - 1))],
      birthYear: Math.floor(Math.random() * (this.currentYear - 1900) + 1900),
      bio: demoContents[Math.floor(Math.random() * demoContents.length)],
      password: 'Federico99',
      confirmPassword: 'Federico99'
    });
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);

    return !!(
      control?.invalid &&
      (control?.dirty || control?.touched)
    );
  }

  errorCheck(field: string, error: string): boolean {
    const control = this.registerForm.get(field);

    return !!control?.errors?.[error]!;
  }
}
