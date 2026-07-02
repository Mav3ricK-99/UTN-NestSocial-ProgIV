import { Post } from "../post/post";
import { User } from "../user/user";

export class Comment {

    id: string;
    content: string;
    deleted: boolean;
    post: Post | undefined;
    author: User | undefined;
    parentComment: Comment | undefined;
    createdAt: Date;

    constructor(
        id: string,
        content: string,
        deleted?: boolean,
        createdAt?: Date,
        author?: User,
        post?: Post,
        parentComment?: Comment | undefined
    ) {
        this.id = id;
        this.content = content;
        this.deleted = deleted ?? false;
        this.createdAt = createdAt ?? new Date();
        this.author = author;
        this.post = post;
        this.parentComment = parentComment;
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

    public getPost(): Post | undefined {
        return this.post;
    }

    public getAuthor(): User | undefined {
        return this.author;
    }

    public setAuthor(user: User): void {
        this.author = user;
    }

    public setPost(post: Post): void {
        this.post = post;
    }

    public setParentComment(comment: Comment): void {
        this.parentComment = comment;
    }

    public getParentComment(): Comment | undefined {
        return this.parentComment;
    }

}
