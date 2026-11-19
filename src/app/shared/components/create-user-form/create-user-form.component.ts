import { Component, signal, inject, WritableSignal } from '@angular/core';
import { LucideAngularModule, Dices, Heart, Upload } from 'lucide-angular';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { FormField, FieldTree, form, required, email, minLength, maxLength, min, max, pattern, validate, submit } from '@angular/forms/signals';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from "primeng/password";
import { DividerModule } from 'primeng/divider';
import { User, UserRole } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { demoContents, demoNames, demoUsernames } from '../../../shared/dummyContent/dummy-content';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';

interface Month {
  name: string;
  code: string;
}

interface CreateUserModel {
  email: string;
  name: string;
  surname: string;
  username: string;
  birthDay: number | null;
  birthMonth: Month | null;
  birthYear: number | null;
  bio: string;
  password: string;
  confirmPassword: string;
  /** Rol que tendra el nuevo usuario */
  role: UserRole | null;
  /** Nombre del archivo seleccionado (el File en si se guarda en selectedFile) */
  avatar: string;
}

const ALLOWED_AVATAR_TYPES = ['jpeg', 'png', 'webp', 'jpg', 'jfif'];

/**
 * Formulario de alta de usuario para el Administrador (/dashboard).
 * Es igual al de registro (RegisterFormComponent) pero permite elegir el Rol del nuevo usuario
 * y envia los datos a UserService.createUser.
 */
@Component({
  selector: 'app-create-user-form',
  imports: [InputTextModule, FloatLabelModule, MessageModule, FormField, FormsModule, PasswordModule, DividerModule, ToastModule, LucideAngularModule, SelectModule],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.css',
  providers: [MessageService]
})
export class CreateUserFormComponent {
  readonly Dices = Dices;
  readonly Heart = Heart;
  readonly Upload = Upload;

  selectedFile: File | undefined;

  public router = inject(Router);

  private messageService = inject(MessageService);
  private userService = inject(UserService);

  readonly meses: Month[] = [
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

  /** Opciones del select de Rol: los valores del enum UserRole */
  readonly roles: UserRole[] = Object.values(UserRole);

  public currentYear = new Date().getFullYear();

  public imagePreview = signal<string | null>(null);

  private readonly initialModel: CreateUserModel = {
    email: '',
    name: '',
    surname: '',
    username: '',
    birthDay: null,
    birthMonth: null,
    birthYear: null,
    bio: '',
    password: '',
    confirmPassword: '',
    role: UserRole.USER,
    avatar: '',
  };

  private readonly createUserModel = signal<CreateUserModel>({ ...this.initialModel });

  /**
   * Los errores del backend (emailExists / usernameExists) se devuelven desde la accion de submit.
   * Signal Forms los asocia al campo y los limpia solo cuando el usuario modifica ese campo.
   */
  public createUserForm = form(this.createUserModel, (path) => {
    required(path.email);
    email(path.email);

    required(path.name);
    minLength(path.name, 2);

    required(path.surname);
    minLength(path.surname, 2);

    required(path.username);
    minLength(path.username, 5);
    pattern(path.username, /^[a-zA-Z0-9._]+$/);

    required(path.birthDay);
    min(path.birthDay, 1);
    max(path.birthDay, 31);

    required(path.birthMonth);
    validate(path.birthMonth, ({ value }) => {
      const selected = value();
      if (!selected) return undefined;
      const month = Number(selected.code);
      return isNaN(month) || month < 1 || month > 12 ? { kind: 'invalidMonth' } : undefined;
    });

    required(path.birthYear);
    min(path.birthYear, 1900);
    max(path.birthYear, this.currentYear);

    maxLength(path.bio, 250);

    required(path.password);
    minLength(path.password, 8);

    required(path.confirmPassword);

    // Validaciones cruzadas entre contraseñas
    validate(path.confirmPassword, ({ value, valueOf }) =>
      value() !== '' && value() !== valueOf(path.password) ? { kind: 'noMatch' } : undefined
    );
    validate(path.password, ({ value, valueOf }) => {
      const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
      const pass = value();
      const confirm = valueOf(path.confirmPassword);
      if (pass === '' || confirm === '') return undefined;
      return !regex.test(pass) || !regex.test(confirm) ? { kind: 'notSecure' } : undefined;
    });

    required(path.role);

    required(path.avatar);
    validate(path.avatar, ({ value }) => {
      const file = value();
      if (!file) return undefined;
      const lastDot = file.lastIndexOf('.');
      const ext = lastDot !== -1 ? file.substring(lastDot + 1).toLowerCase() : '';
      return ALLOWED_AVATAR_TYPES.includes(ext) ? undefined : { kind: 'invalidFileType' };
    });
  });

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.createUserForm.avatar().value.set(this.selectedFile.name);
    this.createUserForm.avatar().markAsTouched();

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(this.selectedFile);
  }

  onCreateUserSubmit() {
    if (this.selectedFile == undefined) return;

    submit(this.createUserForm, async (f) => {
      const value = this.createUserModel();
      const userFullName: string = `${value.name} ${value.surname}`;
      const birthDate: Date = new Date();
      birthDate.setFullYear(value.birthYear!);
      birthDate.setMonth(Number(value.birthMonth!.code) - 1);
      birthDate.setDate(value.birthDay!);

      const newUser: User = new User('0', userFullName, value.email, value.username, birthDate, value.bio, '', value.role!, true, new Date());

      try {
        await firstValueFrom(this.userService.createUser(newUser, value.password, value.confirmPassword, this.selectedFile!));
      } catch (e) {
        const err = e as HttpErrorResponse;
        if (err.status === 400) {
          const isEmailError = err.error?.message?.includes('email');
          return isEmailError
            ? { kind: 'emailExists', fieldTree: f.email }
            : { kind: 'usernameExists', fieldTree: f.username };
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
        console.log(err);
        return undefined;
      }

      this.createUserForm().reset({ ...this.initialModel });
      this.selectedFile = undefined;
      this.imagePreview.set(null);

      // Se recarga el dashboard para que el listado de usuarios incluya al usuario recien creado
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/dashboard']);
      });
      return undefined;
    });
  }

  randomizeData() {
    this.createUserModel.update(model => ({
      ...model,
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
    }));
  }

  /**
   * Para componentes de PrimeNG que tienen un input propio 'pattern' (p-password, p-select) y por eso
   * no pueden usar [formField] directamente: se enlazan con ngModel y se sincronizan con el campo.
   */
  setValue<T>(state: { value: WritableSignal<T>; markAsDirty(): void }, value: T) {
    state.value.set(value);
    state.markAsDirty();
  }

  /** Muestra errores de validacion solo cuando el campo fue tocado o modificado */
  isInvalid<T>(field: FieldTree<T>): boolean {
    const state = field();
    return state.invalid() && (state.dirty() || state.touched());
  }

  errorCheck<T>(field: FieldTree<T>, error: string): boolean {
    return field().errors().some(e => e.kind === error);
  }
}
