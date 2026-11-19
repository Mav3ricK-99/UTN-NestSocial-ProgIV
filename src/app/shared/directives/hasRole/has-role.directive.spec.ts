import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HasRoleDirective } from './has-role.directive';
import { UserService } from '../../../core/services/User/user.service';
import { User, UserRole } from '../../../classes/user/user';

@Component({
  imports: [HasRoleDirective],
  template: `
    <p id="admin" *appHasRole="'ADMIN'">admin</p>
    <p id="owner" *appHasRole="'ADMIN'; orOwner: ownerId()">owner</p>
    <p id="else" *appHasRole="'ADMIN'; else noAccess">ok</p>
    <ng-template #noAccess><p id="denied">denied</p></ng-template>
  `,
})
class HostComponent {
  ownerId = signal('u1');
}

describe('HasRoleDirective', () => {
  const user = (id: string, role: UserRole) =>
    new User(id, 'Name', 'a@b.c', 'user', new Date(), '', '', role, true, new Date());

  async function setup(loggedIn: User | null) {
    const userService = TestBed.inject(UserService);
    (userService as any)._user.set(loggedIn);
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const has = (id: string) => !!(fixture.nativeElement as HTMLElement).querySelector('#' + id);
    return { fixture, userService, has };
  }

  it('muestra el contenido a un admin', async () => {
    const { has } = await setup(user('u2', UserRole.ADMIN));
    expect(has('admin')).toBe(true);
    expect(has('denied')).toBe(false);
  });

  it('oculta el contenido a un usuario común y muestra el else', async () => {
    const { has } = await setup(user('u2', UserRole.USER));
    expect(has('admin')).toBe(false);
    expect(has('denied')).toBe(true);
  });

  it('habilita al dueño del recurso aunque no sea admin', async () => {
    const { has, fixture } = await setup(user('u1', UserRole.USER));
    expect(has('owner')).toBe(true);

    fixture.componentInstance.ownerId.set('otro');
    await fixture.whenStable();
    expect(has('owner')).toBe(false);
  });

  it('no muestra nada si no hay sesión y reacciona al login', async () => {
    const { has, fixture, userService } = await setup(null);
    expect(has('admin')).toBe(false);

    (userService as any)._user.set(user('u9', UserRole.ADMIN));
    await fixture.whenStable();
    expect(has('admin')).toBe(true);
  });
});
