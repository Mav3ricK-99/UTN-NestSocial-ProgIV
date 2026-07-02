export class User {

    id: string;
    userFullName: string;
    email: string;
    username: string;
    birthDate: Date;
    bio: string;
    avatarPathUrl: string;
    createdAt: Date;

    constructor(
        id: string,
        userFullName: string,
        email: string,
        username: string,
        birthDate: Date,
        bio: string,
        avatarPathUrl: string,
        createdAt: Date) {
        this.id = id;
        this.userFullName = userFullName;
        this.email = email;
        this.username = username;
        this.birthDate = birthDate;
        this.bio = bio;
        this.avatarPathUrl = avatarPathUrl;
        this.createdAt = createdAt;
    }

    public getUserFullName(): string {
        return this.userFullName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getUserName(): string {
        return this.username;
    }

    public getBirthDate(): Date {
        return this.birthDate;
    }

    public getBio(): string {
        return this.bio;
    }

    public getAvatarPathUrl(): string {
        return this.avatarPathUrl;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}
