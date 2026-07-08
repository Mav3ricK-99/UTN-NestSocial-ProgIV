import { Post } from "../post/post";
import { User } from "../user/user";

export class Comment {

    id: string;
    content: string;
    deleted: boolean;
    postId: string | undefined;
    author: User | undefined;
    parentComment: Comment | undefined;
    parentAuthor: User | undefined;
    createdAt: Date;

    constructor(
        id: string,
        content: string,
        deleted?: boolean,
        createdAt?: Date,
        author?: User,
        postId?: string,
        parentComment?: Comment | undefined,
        parentAuthor?: User | undefined
    ) {
        this.id = id;
        this.content = content;
        this.deleted = deleted ?? false;
        this.createdAt = createdAt ?? new Date();
        this.author = author;
        this.postId = postId;
        this.parentComment = parentComment;
        this.parentAuthor = parentAuthor;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): string {
        return this.content;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getPostId(): string | undefined {
        return this.postId;
    }

    public getAuthor(): User | undefined {
        return this.author;
    }

    public setAuthor(user: User): void {
        this.author = user;
    }

    public setPostId(post: string): void {
        this.postId = post;
    }

    public setParentComment(comment: Comment): void {
        this.parentComment = comment;
    }

    public getParentComment(): Comment | undefined {
        return this.parentComment;
    }

    public setParentAuthor(user: User): void {
        this.parentAuthor = user;
    }

    public getParentAuthor(): User | undefined {
        return this.parentAuthor;
    }

}
