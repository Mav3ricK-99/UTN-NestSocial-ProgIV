import { computed, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRole } from '../../../classes/user/user';
import { UserService } from '../../../core/services/User/user.service';

/**
 * Directiva estructural que renderiza el contenido solo si el usuario logueado tiene alguno de los roles
 * indicados, o (opcionalmente) si es el dueño del recurso.
 *
 * Ejemplos:
 *   <button *appHasRole="'ADMIN'">Solo admins</button>
 *   <button *appHasRole="['ADMIN', 'USER']">Cualquier rol listado</button>
 *   <button *appHasRole="'ADMIN'; orOwner: post().getOp()?.getId()">Admin o dueño del post</button>
 *   <button *appHasRole="'ADMIN'; else noAccess">...</button> <ng-template #noAccess>...</ng-template>
 *
 * Es reactiva: si el usuario inicia/cierra sesión o cambia el recurso, la vista se crea o se destruye sola.
 */
@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private readonly userService = inject(UserService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  /** Rol (o lista de roles) que habilita el contenido. */
  readonly appHasRole = input.required<UserRole | `${UserRole}` | ReadonlyArray<UserRole | `${UserRole}`>>();

  /** Id del dueño del recurso: si coincide con el usuario logueado, también se habilita el contenido. */
  readonly appHasRoleOrOwner = input<string | null | undefined>();

  /** Plantilla alternativa que se muestra cuando NO se cumple la condición. */
  readonly appHasRoleElse = input<TemplateRef<unknown> | null | undefined>();

  private readonly allowed = computed(() => {
    const user = this.userService.loggedInUser();
    if (!user) return false;

    const required = this.appHasRole();
    const roles: ReadonlyArray<string> = Array.isArray(required) ? required : [required as string];
    if (roles.includes(user.getRole())) return true;

    const ownerId = this.appHasRoleOrOwner();
    return ownerId != null && ownerId === user.getId();
  });

  constructor() {
    effect(() => {
      const allowed = this.allowed();
      const elseTemplate = this.appHasRoleElse();

      this.viewContainer.clear();
      if (allowed) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (elseTemplate) {
        this.viewContainer.createEmbeddedView(elseTemplate);
      }
    });
  }
}
