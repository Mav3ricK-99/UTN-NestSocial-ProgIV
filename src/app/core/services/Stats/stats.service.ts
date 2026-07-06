import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatsService {

  apiPath: string = (environment.BASE_URI + 'api/stats/');

  private httpClient = inject(HttpClient);

  constructor() { }

  postsPerUser(minDate?: number, maxDate?: number) {
    return this.httpClient.get<any>(this.apiPath + 'posts-per-user', {
      params: this.buildDateParams(minDate, maxDate),
      withCredentials: true,
    });
  }

  commentsPerUser(minDate?: number, maxDate?: number) {
    return this.httpClient.get<any>(this.apiPath + 'comments', {
      params: this.buildDateParams(minDate, maxDate),
      withCredentials: true,
    });
  }

  commentsPerPost(minDate?: number, maxDate?: number) {
    return this.httpClient.get<any>(this.apiPath + 'comments-per-post', {
      params: this.buildDateParams(minDate, maxDate),
      withCredentials: true,
    });
  }

  likesPerDay(minDate?: number, maxDate?: number) {
    return this.httpClient.get<any>(this.apiPath + 'likes-per-day', {
      params: this.buildDateParams(minDate, maxDate),
      withCredentials: true,
    });
  }

  loginsPerUser() {
    return this.httpClient.get<any>(this.apiPath + 'logins-per-user', {
      withCredentials: true,
    });
  }

  profileVisits() {
    return this.httpClient.get<any>(this.apiPath + 'profile-visits', {
      withCredentials: true,
    });
  }

  private buildDateParams(minDate?: number, maxDate?: number): HttpParams {
    let params = new HttpParams();

    if (minDate) {
      params = params.set('minDate', minDate);
    }

    if (maxDate) {
      params = params.set('maxDate', maxDate);
    }

    return params;
  }
}
