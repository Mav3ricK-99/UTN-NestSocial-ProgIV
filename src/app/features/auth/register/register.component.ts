import { Component, signal, ElementRef, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, RouterLink, InputTextModule, FloatLabelModule, PostComponent, SelectModule, MessageModule, FormsModule, ReactiveFormsModule, PasswordModule, DividerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  readonly Heart = Heart
  readonly Upload = Upload
  readonly Dices = Dices

  @ViewChild('avatarInput') avatarElement!: ElementRef<HTMLInputElement>;
  readonly meses = [
    { name: 'Enero', code: '01' },
    { name: 'Febrero', code: '02' },
    { name: 'Marzo', code: '03' },
    { name: 'Abril', code: '04' },
    { name: 'Mayo', code: '05' },
    { name: 'Junio', code: '06' },
    { name: 'Julio', code: '07' },
    { name: 'Agosto', code: '08' },
    { name: 'Septiembre', code: '09' },
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

  demoPost: Post = {
    id: '0',
    authorName: this.demoNames[Math.floor(Math.random() * this.demoNames.length)],
    username: this.demoUsernames[Math.floor(Math.random() * this.demoUsernames.length)],
    profileImage: 'https://i.pravatar.cc/150',
    content: this.demoContents[Math.floor(Math.random() * this.demoContents.length)],
    image: 'https://picsum.photos/640/480',
    likes: Math.floor(Math.random() * (3200 - 5) + 5),
    comments: Math.floor(Math.random() * (100 - 1) + 1),
    reposts: Math.floor(Math.random() * (50 - 1) + 1),
    createdAt: new Date(),
    liked: true
  };

  public registerForm: FormGroup;

  public currentYear = new Date().getFullYear();

  public disableSubmit: boolean = false;

  public imagePreview = signal<string | null>(null);

  constructor(private formBuilder: FormBuilder) {
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
        'image/jpeg',
        'image/png',
        'image/webp'
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

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  onRegisterSubmit() {
    this.disableSubmit = true;
  }

  randomizeData() {
    this.registerForm.patchValue({
      username: this.demoUsernames[Math.floor(Math.random() * this.demoUsernames.length)],
      name: this.demoNames[Math.floor(Math.random() * this.demoNames.length)],
      surname: this.demoNames[Math.floor(Math.random() * this.demoNames.length)],
      email: 'federico1999g@gmail.com',
      birthDay: Math.floor(Math.random() * (28 - 1) + 1),
      birthMonth: Math.floor(Math.random() * (12 - 1) + 1),
      birthYear: Math.floor(Math.random() * (this.currentYear - 1900) + 1900),
      bio: this.demoContents[Math.floor(Math.random() * this.demoContents.length)],
      password: '12345678A',
      confirmPassword: '12345678A'
    });
    this.imagePreview.set('https://i.pravatar.cc/150?img=3');
    this.loadRandomImage();
  }

  async loadRandomImage() {

    const response = await fetch('./default-avatar.jfif');
    const blob = await response.blob();

    const file = new File(
      [blob],
      'default-avatar.jfif',
      {
        type: blob.type
      }
    );

    const dt = new DataTransfer();

    dt.items.add(file);

    this.avatarElement.nativeElement.files = dt.files;
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
