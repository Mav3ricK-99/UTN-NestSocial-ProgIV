import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../../classes/user/user';
import { enviroment } from '../../../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  apiPath: string = (enviroment.BASE_URI + 'api/authentication/');

  private _user = signal<User | null>(null);

  loggedInUser = this._user.asReadonly();

  isUserLoggedIn = computed(() => !!this._user());

  private httpClient = inject(HttpClient);

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

    return this.httpClient.post<User>(this.apiPath + 'login', loginBody);
  }

  refreshToken() {
    /* this.httpClient.post<User>(this.apiPath + 'update', user).subscribe((resp) => {
      console.log('wtf is this:', resp);
    }); */
  }

  updateUser(user: User) {
    /* this.httpClient.post<User>(this.apiPath + 'update', user).subscribe((resp) => {
      console.log('wtf is this:', resp);
    }); */
  }

  public buildUser(rawUser: any): User {
    const id = rawUser._id ?? '';
    return new User(id, rawUser.userFullName, rawUser.email, rawUser.username, rawUser.birthDate, rawUser.bio, rawUser.avatarPathUrl, rawUser.createdAt);
  }
}
