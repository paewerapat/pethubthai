import { ExecutionContext, HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { PostRateLimitGuard } from './post-rate-limit.guard';
import { Post } from '../../entities/post.entity';

const mockPostRepo = () => ({ count: jest.fn() });

const makeContext = (userId: string | null): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user: userId ? { id: userId } : null }),
    }),
  } as unknown as ExecutionContext);

describe('PostRateLimitGuard', () => {
  let guard: PostRateLimitGuard;
  let postRepo: ReturnType<typeof mockPostRepo>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostRateLimitGuard,
        { provide: getRepositoryToken(Post), useFactory: mockPostRepo },
      ],
    }).compile();

    guard = module.get<PostRateLimitGuard>(PostRateLimitGuard);
    postRepo = module.get(getRepositoryToken(Post));
  });

  afterEach(() => jest.clearAllMocks());

  it('should allow when user has posted fewer than 3 times today', async () => {
    postRepo.count.mockResolvedValue(2);

    const result = await guard.canActivate(makeContext('user-uuid'));

    expect(result).toBe(true);
  });

  it('should block when user has already posted 3 times today', async () => {
    postRepo.count.mockResolvedValue(3);

    await expect(guard.canActivate(makeContext('user-uuid'))).rejects.toThrow(HttpException);
  });

  it('should throw Unauthorized when no user in request', async () => {
    await expect(guard.canActivate(makeContext(null))).rejects.toThrow(HttpException);
    expect(postRepo.count).not.toHaveBeenCalled();
  });

  it('should query only today posts for the current user', async () => {
    postRepo.count.mockResolvedValue(0);

    await guard.canActivate(makeContext('user-uuid'));

    const callArg = postRepo.count.mock.calls[0][0];
    expect(callArg.where.userId).toBe('user-uuid');
    expect(callArg.where.createdAt).toBeDefined();
  });
});
