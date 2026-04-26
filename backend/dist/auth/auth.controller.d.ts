import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            provider: import("../entities/user.entity").AuthProvider;
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
            provider: import("../entities/user.entity").AuthProvider;
            providerId: string;
            posts: import("../entities/post.entity").Post[];
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    getProfile(req: any): Promise<any>;
    googleAuth(): void;
    googleCallback(req: any, res: Response): void;
    facebookAuth(): void;
    facebookCallback(req: any, res: Response): void;
}
