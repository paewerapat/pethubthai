import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, AuthProvider } from '../entities/user.entity';

const mockUserRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = { sign: jest.fn(() => 'mock.jwt.token') };

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof mockUserRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  // ── register ──────────────────────────────────────────────────────────────
  describe('register', () => {
    const dto = { name: 'Test User', email: 'test@pethub.th', password: '123456' };

    it('should register a new user and return access_token', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const fakeUser = { id: 'uuid-1', ...dto, password: 'hashed', provider: AuthProvider.LOCAL };
      userRepo.create.mockReturnValue(fakeUser);
      userRepo.save.mockResolvedValue(fakeUser);

      const result = await service.register(dto);

      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepo.findOne.mockResolvedValue({ email: dto.email });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('should hash the password before saving', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockImplementation((data) => data);
      userRepo.save.mockImplementation(async (u) => ({ ...u, id: 'uuid-1' }));

      await service.register(dto);

      const savedArg = userRepo.create.mock.calls[0][0];
      expect(savedArg.password).not.toBe(dto.password);
      const isHashed = await bcrypt.compare(dto.password, savedArg.password);
      expect(isHashed).toBe(true);
    });
  });

  // ── login ─────────────────────────────────────────────────────────────────
  describe('login', () => {
    it('should return access_token on valid credentials', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      userRepo.findOne.mockResolvedValue({
        id: 'uuid-1',
        email: 'test@pethub.th',
        password: hashed,
        provider: AuthProvider.LOCAL,
      });

      const result = await service.login({ email: 'test@pethub.th', password: 'password123' });

      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nope@pethub.th', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      userRepo.findOne.mockResolvedValue({
        id: 'uuid-1',
        email: 'test@pethub.th',
        password: hashed,
        provider: AuthProvider.LOCAL,
      });

      await expect(
        service.login({ email: 'test@pethub.th', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ── generateToken ─────────────────────────────────────────────────────────
  describe('generateToken', () => {
    it('should call jwtService.sign with sub and email', () => {
      const user = { id: 'uuid-1', email: 'test@pethub.th' } as User;
      service.generateToken(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'uuid-1',
        email: 'test@pethub.th',
      });
    });
  });

  // ── findOrCreateOAuthUser ─────────────────────────────────────────────────
  describe('findOrCreateOAuthUser', () => {
    const provider = AuthProvider.GOOGLE;
    const providerId = 'google-123';
    const email = 'oauth@gmail.com';
    const name = 'OAuth User';

    it('should return existing user if found', async () => {
      const existing = { id: 'uuid-2', email, name, provider, providerId };
      userRepo.findOne.mockResolvedValue(existing);

      const result = await service.findOrCreateOAuthUser(provider, providerId, email, name);

      expect(result).toEqual(existing);
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('should create and save a new user if not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const newUser = { id: 'uuid-3', email, name, provider, providerId };
      userRepo.create.mockReturnValue(newUser);
      userRepo.save.mockResolvedValue(newUser);

      const result = await service.findOrCreateOAuthUser(provider, providerId, email, name);

      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ provider, providerId, email, name }),
      );
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newUser);
    });
  });

  // ── validateUser ──────────────────────────────────────────────────────────
  describe('validateUser', () => {
    it('should return user by id', async () => {
      const user = { id: 'uuid-1', email: 'test@pethub.th' };
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.validateUser('uuid-1');

      expect(result).toEqual(user);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
    });

    it('should return null if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const result = await service.validateUser('unknown-id');
      expect(result).toBeNull();
    });
  });
});
