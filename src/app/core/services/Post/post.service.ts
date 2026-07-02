import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../../../classes/post/post';
import { PostFilter } from '../../../classes/postFilter/post-filter';
import { Observable } from 'rxjs';
import { Comment } from '../../../classes/comment/comment';
import { environment } from '../../../../../src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PostService {

  apiPath: string = (environment.BASE_URI + 'api/post');

  private httpClient = inject(HttpClient);

  constructor() { }

  createPost(post: Post): Observable<Post> {
    const formData = new FormData();

    formData.append('content', post.getContent());
    const base64PostImage: string | undefined = post.getPostImage()
    if (base64PostImage != undefined) {
      formData.append('postImage', this.base64ToBlob(base64PostImage));
    }
    return this.httpClient.post<Post>(this.apiPath + '/', formData, {
      withCredentials: true
    });
  }

  getPost(id: string): Observable<Post> {
    let params = new HttpParams({
      fromObject: {
        id: id,
      }
    });

    return this.httpClient.get<Post>(this.apiPath + '/get', { params, withCredentials: true });
  }

  getPosts(postFilter: PostFilter): Observable<Post[]> {
    let params = new HttpParams({
      fromObject: {
        minDate: postFilter.minDate,
        maxDate: postFilter.maxDate,
        sortBy: postFilter.orderBy,
        limit: postFilter.limit,
      }
    });

    return this.httpClient.get<Post[]>(this.apiPath, { params, withCredentials: true });
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(this.apiPath + `/${postId}/comment`, { withCredentials: true });
  }

  postComment(postId: string, comment: Comment): Observable<Comment> {
    const rawData: any = {
      content: comment.getContent()
    }

    if (comment.getParentComment()) {
      rawData.parentComment = comment.getParentComment()?.getId()!;
    }

    return this.httpClient.post<Comment>(this.apiPath + `/${postId}/comment`, rawData, { withCredentials: true });
  }

  getMostLiked(): Observable<Post[]> {
    let params = new HttpParams({
      fromObject: {
        sortBy: 'most_liked',
      }
    });

    return this.httpClient.get<Post[]>(this.apiPath, { params, withCredentials: true });
  }

  likeAPost(id: string): Observable<Post> {
    const rawData: any = {
      "postId": id
    };

    return this.httpClient.post<Post>(this.apiPath + '/like', rawData, {
      withCredentials: true
    });
  }

  deletePost(id: string) {
    this.httpClient.delete<Post>(this.apiPath + `/delete/${id}`, {
      withCredentials: true
    }).subscribe((resp) => {
      console.log('wtf is this:', resp);
    });
  }

  getPostsFromUser(username: string): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.apiPath + `/getPostsFromUser/${username}`, {
      withCredentials: true
    });
  }

  public buildPost(rawPost: any): Post {
    return new Post(rawPost._id, rawPost.content, rawPost.postImage, rawPost.likesCount, rawPost.commentsCount, rawPost.sharesCount, rawPost.deleted, rawPost.userLiked, rawPost.createdAt);
  }

  public buildComment(rawComment: any): Comment {
    return new Comment(rawComment.id, rawComment.content, rawComment.deleted, rawComment.createdAt);
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
