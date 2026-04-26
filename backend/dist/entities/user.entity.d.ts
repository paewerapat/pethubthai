import { Post } from './post.entity';
export declare enum AuthProvider {
    LOCAL = "local",
    GOOGLE = "google",
    FACEBOOK = "facebook"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    provider: AuthProvider;
    providerId: string;
    posts: Post[];
    createdAt: Date;
    updatedAt: Date;
}
