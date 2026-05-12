import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post, PetType, PetGender, PostStatus } from '../entities/post.entity';
import { PostImage } from '../entities/post-image.entity';
import { User } from '../entities/user.entity';

const mockPostRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockPostImageRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const makePost = (overrides = {}): Post =>
  ({
    id: 'post-uuid',
    petName: 'โกลด์',
    petType: PetType.DOG,
    gender: PetGender.MALE,
    status: PostStatus.LOST,
    lostDate: new Date('2026-04-01'),
    lostLocation: 'บางนา กรุงเทพฯ',
    latitude: 13.68,
    longitude: 100.61,
    phoneNumber: '0812345678',
    posterName: 'เจ้าของ',
    userId: 'user-uuid',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Post);

const makeUser = (overrides = {}): User =>
  ({ id: 'user-uuid', name: 'Test User', email: 'test@pethub.th', ...overrides } as User);

describe('PostsService', () => {
  let service: PostsService;
  let postRepo: ReturnType<typeof mockPostRepo>;
  let postImageRepo: ReturnType<typeof mockPostImageRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useFactory: mockPostRepo },
        { provide: getRepositoryToken(PostImage), useFactory: mockPostImageRepo },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepo = module.get(getRepositoryToken(Post));
    postImageRepo = module.get(getRepositoryToken(PostImage));
  });

  afterEach(() => jest.clearAllMocks());

  // ── create ────────────────────────────────────────────────────────────────
  describe('create', () => {
    const dto = {
      petName: 'โกลด์',
      petType: PetType.DOG,
      gender: PetGender.MALE,
      status: PostStatus.LOST,
      lostDate: '2026-04-01',
      lostLocation: 'บางนา กรุงเทพฯ',
      latitude: 13.68,
      longitude: 100.61,
      phoneNumber: '0812345678',
      posterName: 'เจ้าของ',
      images: [{ imageUrl: 'http://example.com/img.jpg', order: 0 }],
    };

    it('should create a post with images', async () => {
      const saved = makePost();
      postRepo.create.mockReturnValue(saved);
      postRepo.save.mockResolvedValue(saved);
      postImageRepo.create.mockReturnValue({ imageUrl: dto.images[0].imageUrl, order: 0 });
      postImageRepo.save.mockResolvedValue([]);
      postRepo.findOne.mockResolvedValue({ ...saved, images: [dto.images[0]] });

      const result = await service.create(dto as any, makeUser());

      expect(postRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ petName: 'โกลด์', userId: 'user-uuid' }),
      );
      expect(postImageRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });
  });

  // ── findAll ───────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const posts = [makePost(), makePost({ id: 'post-2' })];
      const getManyAndCount = jest.fn().mockResolvedValue([posts, 2]);
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount,
      };
      postRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should filter by status when provided', async () => {
      const getManyAndCount = jest.fn().mockResolvedValue([[], 0]);
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount,
      };
      postRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll(1, 10, 'lost');

      expect(qb.andWhere).toHaveBeenCalledWith('post.status = :status', { status: 'lost' });
    });

    it('should filter by petType when provided', async () => {
      const getManyAndCount = jest.fn().mockResolvedValue([[], 0]);
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount,
      };
      postRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll(1, 10, undefined, 'cat');

      expect(qb.andWhere).toHaveBeenCalledWith('post.petType = :petType', { petType: 'cat' });
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return the post if found', async () => {
      const post = makePost();
      postRepo.findOne.mockResolvedValue(post);

      const result = await service.findOne('post-uuid');

      expect(result).toEqual(post);
      expect(postRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'post-uuid' },
        relations: ['images', 'user'],
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      postRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  // ── update ────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update post when user is the owner', async () => {
      const post = makePost();
      postRepo.findOne.mockResolvedValue(post);
      postRepo.save.mockResolvedValue(post);

      const updated = makePost({ petName: 'โกลด์ Updated' });
      postRepo.findOne.mockResolvedValueOnce(post).mockResolvedValueOnce(updated);

      const result = await service.update('post-uuid', { petName: 'โกลด์ Updated' } as any, makeUser());

      expect(postRepo.save).toHaveBeenCalledTimes(1);
      expect(result.petName).toBe('โกลด์ Updated');
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const post = makePost({ userId: 'other-user-id' });
      postRepo.findOne.mockResolvedValue(post);

      await expect(
        service.update('post-uuid', {} as any, makeUser({ id: 'different-user' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── remove ────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('should delete post when user is the owner', async () => {
      const post = makePost();
      postRepo.findOne.mockResolvedValue(post);
      postRepo.remove.mockResolvedValue(undefined);

      await service.remove('post-uuid', makeUser());

      expect(postRepo.remove).toHaveBeenCalledWith(post);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const post = makePost({ userId: 'other-user-id' });
      postRepo.findOne.mockResolvedValue(post);

      await expect(service.remove('post-uuid', makeUser())).rejects.toThrow(ForbiddenException);
    });
  });

  // ── findByUser ────────────────────────────────────────────────────────────
  describe('findByUser', () => {
    it('should return all posts belonging to user', async () => {
      const posts = [makePost(), makePost({ id: 'post-2' })];
      postRepo.find.mockResolvedValue(posts);

      const result = await service.findByUser('user-uuid');

      expect(result).toHaveLength(2);
      expect(postRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-uuid' } }),
      );
    });
  });
});
