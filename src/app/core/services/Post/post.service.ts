import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../../../classes/post/post';
import { PostFilter } from '../../../classes/postFilter/post-filter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  apiPath: string = (enviroment.BASE_URI + 'api/post/');

  private httpClient = inject(HttpClient);

  constructor() { }

  createPost(post: Post): Observable<Post> {
    const formData = new FormData();

    formData.append('content', post.getContent());
    const base64PostImage: string | undefined = post.getPostImage()
    if (base64PostImage != undefined) {
      formData.append('postImage', this.base64ToBlob(base64PostImage));
    }
    return this.httpClient.post<Post>(this.apiPath, formData);
  }

  getPosts(postFilter: PostFilter): Observable<Post[]> {
    const baseParams = new HttpParams();
    if (postFilter.minDate) { baseParams.set('minDate', postFilter.minDate) };
    if (postFilter.maxDate) { baseParams.set('maxDate', postFilter.maxDate) };
    if (postFilter.orderBy) { baseParams.set('orderBy', postFilter.orderBy) };
    //baseParams.set('usersId', postFilter.usersId);
    baseParams.set('limit', postFilter.limit);

    return this.httpClient.get<Post[]>(this.apiPath, { params: baseParams });
  }

  likeAPost(id: string): Observable<Post> {
    const rawData: any = {
      "postId": id
    };

    return this.httpClient.post<Post>(this.apiPath + 'like', rawData);
  }

  deletePost(id: string) {
    this.httpClient.delete<Post>(this.apiPath + `delete/${id}`).subscribe((resp) => {
      console.log('wtf is this:', resp);
    });
  }

  public buildPost(rawPost: any): Post {
    return new Post(rawPost._id, rawPost.content, rawPost.postImage, rawPost.likesCount, rawPost.commentsCount, rawPost.sharesCount, rawPost.deleted, false, rawPost.createdAt);
  }

  public base64ToBlob(base64: string): Blob {

    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
  //UNDO
}
