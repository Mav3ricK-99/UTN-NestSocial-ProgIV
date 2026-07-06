import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../../classes/user/user';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  apiPath: string = (environment.BASE_URI + 'api/authentication/');

  private _user = signal<User | null>(null);

  loggedInUser = this._user.asReadonly();

  private _exp = signal<Date | null>(null);

  expToken = this._exp.asReadonly();

  isUserLoggedIn = computed(() => !!this._user());

  private httpClient = inject(HttpClient);

  public isRefreshing = false;

  constructor() { }

  createUser(user: User, password: string, passwordConfirm: string, avatar: Blob): Observable<User> {
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

  login(email: string, password: string): Observable<User> {
    const loginBody: any = {
      email: email,
      password: password
    };

    return this.httpClient.post<User>(this.apiPath + 'login', loginBody, {
      withCredentials: true
    });
  }

  me(): Observable<User> {
    return this.httpClient.get<User>(this.apiPath + 'me', {
      withCredentials: true
    });
  }

  refreshToken() {
    this.isRefreshing = true;
    return this.httpClient.post(this.apiPath + 'refresh-token', {}, {
      withCredentials: true
    });
  }

  logOut(): Observable<any> {
    return this.httpClient.post(this.apiPath + 'logout', {}, {
      withCredentials: true
    });
  }

  public setCurrentUser(user: User | null) {
    this._user.set(user);
  }

  public setTokenExpireTime(date: Date) {
    this._exp.set(date);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(this.apiPath + `getUserByUsername/${username}`, {
      withCredentials: true
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiPath + 'getAllUsers', {
      withCredentials: true
    });
  }

  activateUser(id: string): Observable<User> {
    return this.httpClient.put<User>(this.apiPath + `${id}}/enable`, {}, {
      withCredentials: true
    });
  }

  disableUser(id: string): Observable<User> {
    return this.httpClient.patch<User>(this.apiPath + `${id}}/disable`, {}, {
      withCredentials: true
    });
  }

  public buildUser(rawUser: any): User {
    const id = rawUser._id ?? '';
    const enabled = !rawUser.deleted;
    return new User(id, rawUser.userFullName, rawUser.email, rawUser.username, rawUser.birthDate, rawUser.bio, rawUser.avatarPathUrl, rawUser.role, enabled, rawUser.createdAt);
  }
}
