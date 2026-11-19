import { Component, WritableSignal, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, FieldTree, form, required, email, minLength, maxLength, min, max, pattern, validate, submit } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, Upload } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';

interface Month {
  name: string;
  code: string;
}

interface EditProfileModel {
  userFullName: string;
  email: string;
  username: string;
  birthDay: number | null;
  birthMonth: Month | null;
  birthYear: number | null;
  bio: string;
  /** Nombre del archivo elegido, solo para validar la extension (el File esta en selectedFile) */
  avatar: string;
}

const ALLOWED_AVATAR_TYPES = ['jpeg', 'png', 'webp', 'jpg', 'jfif'];
const MIN_AGE = 13;

/**
 * Formulario de edicion de los datos del perfil del usuario logueado (sin contraseña).
 * Se precarga con el usuario recibido en [user] y avisa con (profileUpdated) el usuario ya guardado.
 */
@Component({
  selector: 'app-edit-profile-form',
  imports: [InputTextModule, FloatLabelModule, MessageModule, ButtonModule, ToastModule, FormField, FormsModule, SelectModule, LucideAngularModule],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.css',
  providers: [MessageService]
})
export class EditProfileFormComponent {
  readonly Upload = Upload;

  user = input.required<User>();
  profileUpdated = output<User>();

  private messageService = inject(MessageService);
  private userService = inject(UserService);

  selectedFile: File | undefined;
  imagePreview = signal<string | null>(null);

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

  currentYear = new Date().getFullYear();

  private readonly editProfileModel = signal<EditProfileModel>({
    userFullName: '',
    email: '',
    username: '',
    birthDay: null,
    birthMonth: null,
    birthYear: null,
    bio: '',
    avatar: '',
  });

  public editProfileForm = form(this.editProfileModel, (path) => {
    required(path.userFullName);
    minLength(path.userFullName, 5);

    required(path.email);
    email(path.email);

    required(path.username);
    minLength(path.username, 6);
    pattern(path.username, /^[a-zA-Z0-9._]+$/);

    required(path.birthDay);
    min(path.birthDay, 1);
    max(path.birthDay, 31);

    required(path.birthMonth);

    required(path.birthYear);
    min(path.birthYear, 1900);
    max(path.birthYear, this.currentYear);

    // Misma regla que el backend (IsAdult): edad minima, evaluada con los tres campos de la fecha
    validate(path.birthYear, ({ valueOf }) => {
      const day = valueOf(path.birthDay);
      const month = valueOf(path.birthMonth);
      const year = valueOf(path.birthYear);
      if (!day || !month || !year) return undefined;
      return this.calculateAge(year, Number(month.code), day) < MIN_AGE ? { kind: 'underAge' } : undefined;
    });

    maxLength(path.bio, 255);

    // El avatar es opcional: solo se valida la extension si se eligio uno nuevo
    validate(path.avatar, ({ value }) => {
      const file = value();
      if (!file) return undefined;
      const lastDot = file.lastIndexOf('.');
      const ext = lastDot !== -1 ? file.substring(lastDot + 1).toLowerCase() : '';
      return ALLOWED_AVATAR_TYPES.includes(ext) ? undefined : { kind: 'invalidFileType' };
    });
  });

  constructor() {
    // Carga (y recarga si cambia el usuario) los datos actuales en el formulario
    // untracked: reset lee/escribe los signals del formulario y no debe re-disparar este effect
    effect(() => {
      const user = this.user();
      untracked(() => this.loadUser(user));
    });
  }

  private loadUser(user: User) {
    // birthDate llega como 'YYYY-MM-DD' desde la API; se parte el string para evitar corrimientos por zona horaria
    const [year, month, day] = String(user.getBirthDate()).split('T')[0].split('-').map(Number);

    this.editProfileForm().reset({
      userFullName: user.getUserFullName(),
      email: user.getEmail(),
      username: user.getUserName(),
      birthDay: day || null,
      birthMonth: this.meses.find(m => Number(m.code) === month) ?? null,
      birthYear: year || null,
      bio: user.getBio() ?? '',
      avatar: '',
    });

    this.selectedFile = undefined;
    this.imagePreview.set(null);
  }

  private calculateAge(year: number, month: number, day: number): number {
    const today = new Date();
    let age = today.getFullYear() - year;
    const birthdayPassed = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
    if (!birthdayPassed) age--;
    return age;
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.editProfileForm.avatar().value.set(this.selectedFile.name);
    this.editProfileForm.avatar().markAsTouched();

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit() {
    submit(this.editProfileForm, async (f) => {
      const value = this.editProfileModel();
      const pad = (n: number) => String(n).padStart(2, '0');
      const birthDate = `${value.birthYear}-${pad(Number(value.birthMonth!.code))}-${pad(value.birthDay!)}`;

      let updated: any;
      try {
        updated = await firstValueFrom(this.userService.updateProfile({
          userFullName: value.userFullName.trim(),
          email: value.email.trim(),
          username: value.username.trim(),
          birthDate,
          bio: value.bio,
        }, this.selectedFile));
      } catch (e) {
        const err = e as HttpErrorResponse;
        if (err.status === 400) {
          const raw = err.error?.message;
          const message: string = Array.isArray(raw) ? raw.join('. ') : String(raw ?? '');
          if (message.includes('email ya')) {
            return { kind: 'emailExists', fieldTree: f.email };
          }
          if (message.includes('nombre de usuario ya')) {
            return { kind: 'usernameExists', fieldTree: f.username };
          }
          this.messageService.add({ severity: 'error', summary: 'Datos inválidos', detail: message, life: 4000 });
          return undefined;
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la solicitud. Intentelo nuevamente mas tarde.', life: 3000 });
        console.log(err);
        return undefined;
      }

      this.messageService.add({ severity: 'success', summary: 'Perfil actualizado', detail: 'Tus datos se guardaron correctamente.', life: 3000 });
      this.profileUpdated.emit(this.userService.buildUser(updated));
      return undefined;
    });
  }

  /** Para componentes PrimeNG (p-select) que se enlazan con ngModel en vez de [formField] */
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
