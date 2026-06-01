export class Post {

    public id: string;
    public authorName: string;
    public username: string;
    public profileImage: string;
    public content: string;
    public image?: string;
    public likes: number;
    public comments: number;
    public reposts: number;
    public createdAt: Date;
    public liked: boolean = true;

    constructor(
        id: string,
        authorName: string,
        username: string,
        profileImage: string,
        content: string,
        image: string | undefined,
        likes: number,
        comments: number,
        reposts: number,
        createdAt: Date,
    ) {
        this.id = id;
        this.authorName = authorName;
        this.username = username;
        this.profileImage = profileImage;
        this.content = content;
        this.image = image;
        this.likes = likes;
        this.comments = comments;
        this.reposts = reposts;
        this.createdAt = createdAt;
        this.liked = true;
    }

}
