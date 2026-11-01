import { Component, inject, input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../../classes/user/user';
import { RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/User/user.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-card',
  imports: [AvatarModule, RouterLink, CheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent implements OnInit {

  user = input.required<User>();

  public activateUserForm: FormGroup;

  private messageService = inject(MessageService);

  constructor(private formBuilder: FormBuilder, public userService: UserService) {
    this.activateUserForm = this.formBuilder.group({
      enabled: new FormControl(false)
    });
  }

  ngOnInit() {
    const userActivated = this.user().getEnabled();
    this.activateUserForm.get('enabled')?.setValue(userActivated);
  }

  isOwnCard(): boolean {
    return this.user().getId() === this.userService.loggedInUser()?.getId();
  }

  setUserDisable() {
    const control = this.activateUserForm.get('enabled')!;
    if (control.disabled) return;

    const id = this.user().getId();
    const enabled = !this.user().getEnabled();

    // Se bloquea el checkbox hasta que el servidor responda para evitar clics repetidos.
    control.disable();

    const request$ = enabled
      ? this.userService.activateUser(id)
      : this.userService.disableUser(id);

    request$.pipe(finalize(() => control.enable())).subscribe({
      next: () => {
        this.user().setEnabled(enabled);
      },
      error: () => {
        // El checkbox ya cambió en pantalla: se vuelve al estado real del usuario.
        control.setValue(this.user().getEnabled());
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del usuario. Intentelo nuevamente mas tarde.', life: 3000 });
      }
    });
  }
}
