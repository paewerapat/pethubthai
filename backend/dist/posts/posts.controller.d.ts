import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<import("../entities/post.entity").Post>;
    findAll(page?: string, limit?: string, status?: string, petType?: string, province?: string, amphoe?: string, tambon?: string, category?: string): Promise<{
        data: import("../entities/post.entity").Post[];
        total: number;
        page: number;
        limit: number;
    }>;
    findMyPosts(req: any): Promise<import("../entities/post.entity").Post[]>;
    findOne(id: string): Promise<import("../entities/post.entity").Post>;
    incrementView(id: string): Promise<void>;
    update(id: string, updatePostDto: UpdatePostDto, req: any): Promise<import("../entities/post.entity").Post>;
    remove(id: string, req: any): Promise<void>;
}
