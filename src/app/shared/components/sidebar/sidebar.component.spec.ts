import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../../core/services/User/user.service';
import { User } from '../../../classes/user/user';
import { authInterceptor } from '../../../core/interceptors/authInterceptor/auth.interceptor';
import { guestOnlyGuard } from '../../../guards/GuestOnly/guest-only.guard';

@Component({ template: '' })
class StubPageComponent { }

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'auth', canActivate: [guestOnlyGuard], children: [{ path: 'login', component: StubPageComponent }] },
          { path: 'feed', component: StubPageComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logOut', () => {
    let http: HttpTestingController;
    let router: Router;
    let userService: UserService;

    const unauthorized = { status: 401, statusText: 'Unauthorized' };
    const isUrl = (suffix: string) => (req: { url: string }) => req.url.endsWith(suffix);

    beforeEach(async () => {
      http = TestBed.inject(HttpTestingController);
      router = TestBed.inject(Router);
      userService = TestBed.inject(UserService);

      userService.setCurrentUser(new User('1', 'Ana Perez', 'ana@mail.com', 'anaperez', new Date(), '', '', 'USER', true, new Date()));
      userService.setTokenExpireTime(new Date(Date.now() + 60000));
    });

    afterEach(() => {
      http.verify();
    });

    // El backend invalida las cookies: /me y /refresh-token responden 401.
    async function expectSessionRejectedByBackend() {
      const me = await vi.waitFor(() => http.expectOne(isUrl('/authentication/me')));
      me.flush({}, unauthorized);

      const refresh = await vi.waitFor(() => http.expectOne(isUrl('/authentication/refresh-token')));
      refresh.flush({}, unauthorized);
    }

    it('limpia la sesión y redirige a /auth/login cuando el logout responde bien', async () => {
      component.logOut();
      http.expectOne(isUrl('/authentication/logout')).flush({});

      expect(userService.isUserLoggedIn()).toBe(false);
      expect(userService.expToken()).toBeNull();

      await expectSessionRejectedByBackend();
      await vi.waitFor(() => expect(router.url).toBe('/auth/login'));
    });

    it('limpia la sesión y redirige a /auth/login cuando el logout falla', async () => {
      component.logOut();
      http.expectOne(isUrl('/authentication/logout')).flush({}, { status: 500, statusText: 'Server Error' });

      expect(userService.isUserLoggedIn()).toBe(false);

      await expectSessionRejectedByBackend();
      await vi.waitFor(() => expect(router.url).toBe('/auth/login'));
    });

    it('si el backend deja vigente la cookie de refresh, el guard devuelve al usuario al feed', async () => {
      component.logOut();
      http.expectOne(isUrl('/authentication/logout')).flush({});

      const me = await vi.waitFor(() => http.expectOne(isUrl('/authentication/me')));
      me.flush({}, unauthorized);

      const refresh = await vi.waitFor(() => http.expectOne(isUrl('/authentication/refresh-token')));
      refresh.flush({});

      const syncedMe = await vi.waitFor(() => http.expectOne(isUrl('/authentication/me')));
      syncedMe.flush({ _id: '1', userFullName: 'Ana Perez', email: 'ana@mail.com', username: 'anaperez', role: 'USER', exp: Date.now() / 1000 + 900 });

      await vi.waitFor(() => expect(router.url).toBe('/feed'));
    });
  });
});
