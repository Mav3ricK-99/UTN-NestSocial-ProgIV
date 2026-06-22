import { Component, signal, ElementRef, ViewChild, inject } from '@angular/core';
import { LucideAngularModule, Heart, Upload, Dices } from 'lucide-angular';
import { RouterLink } from "@angular/router";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PostComponent } from '../../../shared/components/post/post.component';
import { Post } from '../../../classes/post/post';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { passwordsMustMatch } from '../../../core/directives/passwordsMustMatch/passwords-must-match.directive';
import { passwordsMustBeSecure } from "../../../core/directives/passwordsMustBeSecure/passwords-must-be-secure.directive";
import { PasswordModule } from "primeng/password";
import { DividerModule } from 'primeng/divider';
import { fileTypeMustBeValid } from '../../../core/directives/fileTypeMustBeValid/file-type-must-be-valid.directive';
import { User } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, RouterLink, InputTextModule, FloatLabelModule, PostComponent, SelectModule, MessageModule, FormsModule, ReactiveFormsModule, PasswordModule, DividerModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  readonly Heart = Heart;
  readonly Upload = Upload;
  readonly Dices = Dices;

  private messageService = inject(MessageService);

  selectedFile: File | undefined;

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

  readonly demoUsernames = [
    'gfalcus0',
    'jboal1',
    'tlivzey2',
    'jcassar3',
    'nbremmer4',
    'wshiell5',
    'pbourhill6',
    'dhamil7',
    'wrankin8',
    'fsherrocks9',
    'puttona',
    'bbeedonb',
    'fgironc',
    'asaurind'
  ];

  readonly demoNames = [
    'Göran',
    'Dorothée',
    'Sòng',
    'Salomé',
    'Torbjörn',
    'Angélique',
    'Mén',
    'Ruì',
    'Edmée',
    'Marylène',
    'Görel',
    'Mahélie',
    'Clémentine',
    'Lài',
    'Marlène',
    'Stéphanie'
  ]

  readonly demoContents = [
    `🚀 Bienvenido a NestSocial. Comparte ideas, conecta con personas y descubre contenido interesante.`,
    `🌟 Descubre nuevas oportunidades y conecta con personas que comparten tus intereses.`,
    `💡 Inspírate con las ideas de otros y comparte tus propias visiones.`,
    `💬 Únete a la conversación y participa en discusiones emocionantes.`,
    `💬 Tu próxima gran conversación empieza aquí.
Publica, comenta y forma parte de una comunidad que comparte tus intereses.`,
    `🌎 Miles de historias esperan ser descubiertas.
Conecta con personas reales y comparte lo que te apasiona.`,
    `✨ Expresa tus ideas sin límites.
Crea publicaciones, interactúa con otros usuarios y haz crecer tu red.`,
    `🔥 Las mejores comunidades nacen de las mejores conversaciones.
Encuentra personas con intereses similares y participa activamente.`,
    `🤝 Conecta, aprende y participa.
Descubre contenido relevante y construye relaciones significativas.`,
    `🌟 Comparte tus ideas, conecta con personas y descubre contenido interesante.`
  ];

  demoUser: User = new User('0',
    this.demoNames[Math.floor(Math.random() * this.demoNames.length)],
    "federico1999g@gmail.com",
    this.demoUsernames[Math.floor(Math.random() * this.demoUsernames.length)],
    new Date(),
    'BIO!',
    'https://i.pravatar.cc/150',
    new Date()
  );

  demoPost: Post = new Post(
    '0',
    this.demoContents[Math.floor(Math.random() * this.demoContents.length)],
    'https://picsum.photos/640/480',
    Math.floor(Math.random() * (3200 - 5) + 5),
    Math.floor(Math.random() * (100 - 1) + 1),
    Math.floor(Math.random() * (50 - 1) + 1),
    true,
    true,
    new Date(),
    this.demoUser
  );

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

      const newUser: User = new User('0', userFullName, email, username, birthDate, bio, '', new Date());
      this.userService.createUser(newUser, password, confirmPassword, this.selectedFile).subscribe({
        next: (rawUser: any) => {
          const user: User = this.userService.buildUser(rawUser);

          //this.newPostEmitted.emit(post);
          this.registerForm.reset();
          this.submitBtnDisabled.set(false);
          this.imagePreview.set(null);
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
      username: this.demoUsernames[Math.floor(Math.random() * this.demoUsernames.length)],
      name: this.demoNames[Math.floor(Math.random() * this.demoNames.length)],
      surname: this.demoNames[Math.floor(Math.random() * this.demoNames.length)],
      email: 'federico1999g@gmail.com',
      birthDay: Math.floor(Math.random() * (28 - 1) + 1),
      birthMonth: this.meses[Math.floor(Math.random() * (12 - 1))],
      birthYear: Math.floor(Math.random() * (this.currentYear - 1900) + 1900),
      bio: this.demoContents[Math.floor(Math.random() * this.demoContents.length)],
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
