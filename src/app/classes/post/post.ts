import { signal } from "@angular/core";
import { User } from "../user/user";

export class Post {

    id: string;
    content: string;
    postImage: string | undefined;
    private readonly likesCount = signal(0);
    private readonly commentsCount = signal(0);
    private readonly sharesCount = signal(0);
    private readonly deleted = signal(false);
    private readonly liked = signal(false);
    op: User | undefined;
    createdAt: Date;

    constructor(id: string, content: string, postImage: string)

    constructor(
        id: string,
        content: string,
        postImage: string | undefined,
        likesCount: number,
        commentsCount: number,
        sharesCount: number,
        deleted: boolean,
        userLiked: boolean,
        createdAt: Date,
        op?: User
    )

    constructor(
        id: string,
        content: string,
        postImage?: string,
        likesCount?: number,
        commentsCount?: number,
        sharesCount?: number,
        deleted?: boolean,
        userLiked?: boolean,
        createdAt?: Date,
        op?: User
    ) {
        this.id = id;
        this.content = content;
        this.postImage = postImage;
        this.likesCount.set(likesCount ?? 0);
        this.commentsCount.set(commentsCount ?? 0);
        this.sharesCount.set(sharesCount ?? 0);
        this.deleted.set(deleted ?? false);
        this.liked.set(userLiked ?? false);
        this.createdAt = createdAt ?? new Date();
        this.op = op;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): string {
        return this.content;
    }

    public getPostImage(): string | undefined {
        return this.postImage;
    }

    public getLikesCount(): number {
        return this.likesCount();
    }

    public getCommentsCount(): number {
        return this.commentsCount();
    }

    public getLiked(): boolean {
        return this.liked();
    }

    public getSharesCount(): number {
        return this.sharesCount();
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public setOp(user: User): void {
        this.op = user;
    }

    public setLiked(liked: boolean): void {
        this.liked.set(liked);
    }

    public setLikesCount(likesCount: number): void {
        this.likesCount.set(likesCount);
    }

    public setCommentsCount(commentsCount: number): void {
        this.commentsCount.set(commentsCount);
    }

    public setSharesCount(sharesCount: number): void {
        this.sharesCount.set(sharesCount);
    }

    public setCounts(post: Post): void {
        this.setLikesCount(post.getLikesCount());
        this.setCommentsCount(post.getCommentsCount());
        this.setSharesCount(post.getSharesCount());
    }

    public setDeleted(deleted: boolean): void {
        this.deleted.set(deleted);
    }

    public getDeleted(): boolean {
        return this.deleted();
    }

    public getOp(): User | undefined {
        return this.op;
    }

    copy(): Post {
        return new Post(
            this.id,
            this.content,
            this.postImage,
            this.likesCount(),
            this.commentsCount(),
            this.sharesCount(),
            this.deleted(),
            this.liked(),
            this.createdAt,
            this.op
        );
    }
}
