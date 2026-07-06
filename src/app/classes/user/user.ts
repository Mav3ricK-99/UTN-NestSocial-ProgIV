export class User {

    id: string;
    userFullName: string;
    email: string;
    username: string;
    birthDate: Date;
    bio: string;
    avatarPathUrl: string;
    role: string;
    enabled: boolean;
    createdAt: Date;

    constructor(
        id: string,
        userFullName: string,
        email: string,
        username: string,
        birthDate: Date,
        bio: string,
        avatarPathUrl: string,
        role: string,
        enabled: boolean,
        createdAt: Date) {
        this.id = id;
        this.userFullName = userFullName;
        this.email = email;
        this.username = username;
        this.birthDate = birthDate;
        this.bio = bio;
        this.avatarPathUrl = avatarPathUrl;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    public getId(): string {
        return this.id;
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

    public getRole(): string {
        return this.role;
    }

    public getEnabled(): boolean {
        return this.enabled;
    }

    public isAdmin(): boolean {
        return this.getRole() == UserRole.ADMIN ? true : false;
    }
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}