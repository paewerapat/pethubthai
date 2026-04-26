import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostImage } from '../entities/post-image.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private postRepository;
    private postImageRepository;
    constructor(postRepository: Repository<Post>, postImageRepository: Repository<PostImage>);
    create(createPostDto: CreatePostDto, user: User): Promise<Post>;
    findAll(page?: number, limit?: number, status?: string, petType?: string): Promise<{
        data: Post[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Post>;
    update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post>;
    remove(id: string, user: User): Promise<void>;
    findByUser(userId: string): Promise<Post[]>;
}
