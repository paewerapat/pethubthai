import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostImage } from '../entities/post-image.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    private postImageRepository: Repository<PostImage>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { images, ...postData } = createPostDto;

    const post = this.postRepository.create({
      ...postData,
      userId: user.id,
    });

    const savedPost = await this.postRepository.save(post);

    if (images && images.length > 0) {
      const postImages = images.map((img) =>
        this.postImageRepository.create({
          ...img,
          postId: savedPost.id,
        }),
      );
      await this.postImageRepository.save(postImages);
    }

    return this.findOne(savedPost.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    petType?: string,
  ): Promise<{ data: Post[]; total: number; page: number; limit: number }> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.createdAt', 'DESC');

    if (status) {
      query.andWhere('post.status = :status', { status });
    }

    if (petType) {
      query.andWhere('post.petType = :petType', { petType });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images', 'user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.userId !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const { images, ...postData } = updatePostDto;

    Object.assign(post, postData);
    await this.postRepository.save(post);

    if (images) {
      await this.postImageRepository.delete({ postId: id });

      if (images.length > 0) {
        const postImages = images.map((img) =>
          this.postImageRepository.create({
            ...img,
            postId: id,
          }),
        );
        await this.postImageRepository.save(postImages);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string, user: User): Promise<void> {
    const post = await this.findOne(id);

    if (post.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { userId },
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }
}
