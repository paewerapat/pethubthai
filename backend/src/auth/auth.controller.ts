import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import passport from 'passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const { password, ...user } = req.user;
    return user;
  }

  // ── Google OAuth ──
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Request() req, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontend}/auth/callback?token=${token}`);
  }

  // ── Facebook OAuth ──
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookCallback(@Request() req, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontend}/auth/callback?token=${token}`);
  }

  @Get('line')
  @UseGuards(AuthGuard('line'))
  lineLogin() {}

  @Get('line/callback')
  async lineCallback(@Request() req, @Res() res: Response) {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

    await new Promise<void>((resolve) => {
      (passport.authenticate('line', (err: any, user: any) => {
        if (err || !user) {
          console.error('[LINE] callback error:', err?.message ?? 'no user');
          res.redirect(`${frontend}/auth/callback?error=line_failed`);
          return resolve();
        }
        try {
          const token = this.authService.generateToken(user);
          res.redirect(`${frontend}/auth/callback?token=${token}`);
        } catch (e) {
          console.error('[LINE] token error:', (e as Error)?.message);
          res.redirect(`${frontend}/auth/callback?error=line_failed`);
        }
        resolve();
      }) as any)(req, res, () => {
        res.redirect(`${frontend}/auth/callback?error=line_failed`);
        resolve();
      });
    });
  }
}
