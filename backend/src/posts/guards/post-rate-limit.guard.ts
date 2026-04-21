import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Post } from '../../entities/post.entity';

@Injectable()
export class PostRateLimitGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postsToday = await this.postRepository.count({
      where: {
        userId: user.id,
        createdAt: MoreThanOrEqual(today),
      },
    });

    if (postsToday >= 3) {
      throw new HttpException(
        'You have reached the daily limit of 3 posts. Please try again tomorrow.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
