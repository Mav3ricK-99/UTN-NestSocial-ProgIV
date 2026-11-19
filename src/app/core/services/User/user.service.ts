import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../../classes/user/user';
import { catchError, finalize, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

/** Las peticiones con este token no intentan renovar la sesión ante un 401. */
export const SKIP_TOKEN_REFRESH = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class UserService {

  apiPath: string = (environment.BASE_URI + 'api/authentication/');
  userApiPath: string = (environment.BASE_URI + 'api/users/');

  private _user = signal<User | null>(null);

  loggedInUser = this._user.asReadonly();

  private _exp = signal<Date | null>(null);

  expToken = this._exp.asReadonly();

  isUserLoggedIn = computed(() => !!this._user());

  private httpClient = inject(HttpClient);

  private refreshSession$?: Observable<unknown>;

  constructor() { }

  register(user: User, password: string, passwordConfirm: string, avatar: Blob): Observable<User> {
    const formData = new FormData();

    formData.append('userFullName', user.getUserFullName());
    formData.append('email', user.getEmail());
    formData.append('username', user.getUserName());
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);
    formData.append('birthDate', user.getBirthDate().toISOString().split('T')[0]);
    formData.append('bio', user.getBio());

    formData.append('profileAvatar', avatar);

    return this.httpClient.post<User>(this.apiPath + 'register', formData);
  }

  createUser(user: User, password: string, passwordConfirm: string, avatar: Blob): Observable<User> {
    const formData = new FormData();

    formData.append('userFullName', user.getUserFullName());
    formData.append('email', user.getEmail());
    formData.append('username', user.getUserName());
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);
    formData.append('birthDate', user.getBirthDate().toISOString().split('T')[0]);
    formData.append('bio', user.getBio());
    formData.append('role', user.getRole());

    formData.append('profileAvatar', avatar);

    return this.httpClient.post<User>(this.userApiPath + 'createUser', formData, {
      withCredentials: true
    });
  }

  /** Modifica los datos del usuario logueado (PATCH /users/me). birthDate va en formato YYYY-MM-DD. */
  updateProfile(data: { userFullName: string; email: string; username: string; birthDate: string; bio: string }, avatar?: Blob): Observable<User> {
    const formData = new FormData();

    formData.append('userFullName', data.userFullName);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('birthDate', data.birthDate);
    formData.append('bio', data.bio);

    if (avatar) {
      formData.append('profileAvatar', avatar);
    }

    return this.httpClient.patch<User>(this.userApiPath + 'me', formData, {
      withCredentials: true
    });
  }

  login(email: string, password: string): Observable<User> {
    const loginBody: any = {
      email: email,
      password: password
    };

    return this.httpClient.post<User>(this.apiPath + 'login', loginBody, {
      withCredentials: true
    });
  }

  me(skipTokenRefresh = false): Observable<User> {
    return this.httpClient.get<User>(this.apiPath + 'me', {
      withCredentials: true,
      context: new HttpContext().set(SKIP_TOKEN_REFRESH, skipTokenRefresh)
    });
  }

  /**
   * Renueva el token y sincroniza usuario y expiración. Si ya hay una renovación en curso,
   * todos los que la pidan comparten la misma petición en vez de lanzar otra.
   */
  refreshSession(): Observable<unknown> {
    if (!this.refreshSession$) {
      this.refreshSession$ = this.httpClient.post(this.apiPath + 'refresh-token', {}, {
        withCredentials: true
      }).pipe(
        switchMap(() => this.httpClient.get<any>(this.apiPath + 'me', {
          withCredentials: true,
          context: new HttpContext().set(SKIP_TOKEN_REFRESH, true)
        }).pipe(
          tap((rawUser: any) => {
            this.setCurrentUser(this.buildUser(rawUser));
            this.setTokenExpireTime(new Date(rawUser.exp * 1000));
          }),
          // El token ya se renovó: que falle la sincronización no debe invalidar la renovación.
          catchError(() => of(null))
        )),
        finalize(() => this.refreshSession$ = undefined),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    return this.refreshSession$;
  }

  logOut(): Observable<any> {
    return this.httpClient.post(this.apiPath + 'logout', {}, {
      withCredentials: true
    });
  }

  public setCurrentUser(user: User | null) {
    this._user.set(user);
  }

  public setTokenExpireTime(date: Date | null) {
    this._exp.set(date);
  }

  public clearSession() {
    this._user.set(null);
    this._exp.set(null);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(this.userApiPath + `getUserByUsername/${username}`, {
      withCredentials: true
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.userApiPath + 'getAllUsers', {
      withCredentials: true
    });
  }

  activateUser(id: string): Observable<User> {
    return this.httpClient.put<User>(this.userApiPath + `${id}/enable`, {}, {
      withCredentials: true
    });
  }

  disableUser(id: string): Observable<User> {
    return this.httpClient.patch<User>(this.userApiPath + `${id}/disable`, {}, {
      withCredentials: true
    });
  }

  public buildUser(rawUser: any): User {
    const id = rawUser._id ?? '';
    const enabled = !rawUser.deleted;
    return new User(id, rawUser.userFullName, rawUser.email, rawUser.username, rawUser.birthDate, rawUser.bio, rawUser.avatarPathUrl, rawUser.role, enabled, rawUser.createdAt);
  }
}
