import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
export declare class PostRateLimitGuard implements CanActivate {
    private postRepository;
    constructor(postRepository: Repository<Post>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
