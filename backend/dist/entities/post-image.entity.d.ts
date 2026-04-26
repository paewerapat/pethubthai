import { Post } from './post.entity';
export declare class PostImage {
    id: string;
    imageUrl: string;
    order: number;
    post: Post;
    postId: string;
    createdAt: Date;
}
