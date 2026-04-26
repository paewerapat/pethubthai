import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, AuthProvider } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            provider: AuthProvider;
            providerId: string;
            posts: import("../entities/post.entity").Post[];
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            provider: AuthProvider;
            providerId: string;
            posts: import("../entities/post.entity").Post[];
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    findOrCreateOAuthUser(provider: AuthProvider, providerId: string, email: string, name: string, avatar?: string): Promise<User>;
    generateToken(user: User): string;
    validateUser(userId: string): Promise<User | null>;
}
