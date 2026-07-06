import { User } from "../user/user";

export class Post {

    id: string;
    content: string;
    postImage: string | undefined;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    deleted: boolean;
    liked: boolean;
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
        this.likesCount = likesCount ?? 0;
        this.commentsCount = commentsCount ?? 0;
        this.sharesCount = sharesCount ?? 0;
        this.deleted = deleted ?? false;
        this.liked = userLiked ?? false;
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
        return this.likesCount;
    }

    public getCommentsCount(): number {
        return this.commentsCount;
    }

    public getLiked(): boolean {
        return this.liked;
    }

    public getSharesCount(): number {
        return this.sharesCount;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public setOp(user: User): void {
        this.op = user;
    }

    public setLiked(liked: boolean): void {
        this.liked = liked;
    }

    public setLikesCount(likesCount: number): void {
        this.likesCount = likesCount;
    }

    public setCommentsCount(commentsCount: number): void {
        this.commentsCount = commentsCount;
    }

    public setSharesCount(sharesCount: number): void {
        this.sharesCount = sharesCount;
    }

    public setCounts(post: Post): void {
        this.setLikesCount(post.getLikesCount());
        this.setCommentsCount(post.getCommentsCount());
        this.setSharesCount(post.getSharesCount());
    }

    public setDeleted(deleted: boolean): void {
        this.deleted = deleted;
    }

    public getDeleted(): boolean {
        return this.deleted;
    }

    public getOp(): User | undefined {
        return this.op;
    }

    copy(): Post {
        return new Post(
            this.id,
            this.content,
            this.postImage,
            this.likesCount,
            this.commentsCount,
            this.sharesCount,
            this.deleted,
            this.liked,
            this.createdAt,
            this.op
        );
    }
}
