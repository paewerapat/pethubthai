import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../../entities/user.entity';

// LINE requires `state` param. Without sessions we use a stateless store:
// generates a random state for the redirect, always verifies as valid on callback.
const statelessStore = {
  store: (_req: any, cb: (err: any, state: string) => void) =>
    cb(null, Math.random().toString(36).slice(2)),
  verify: (_req: any, _state: string, cb: (err: any, valid: boolean) => void) =>
    cb(null, true),
};

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy, 'line') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      authorizationURL: 'https://access.line.me/oauth2/v2.1/authorize',
      tokenURL: 'https://api.line.me/oauth2/v2.1/token',
      clientID: configService.get<string>('LINE_CHANNEL_ID') as string,
      clientSecret: configService.get<string>('LINE_CHANNEL_SECRET') as string,
      callbackURL: configService.get<string>('LINE_CALLBACK_URL'),
      scope: ['profile', 'openid', 'email'],
      store: statelessStore,
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    tokenParams: any,
    _profile: any,
    done: (err: any, user?: any) => void,
  ) {
    try {
      // ดึง profile จาก LINE API
      const res = await fetch('https://api.line.me/v2/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = (await res.json()) as {
        userId: string;
        displayName: string;
        pictureUrl?: string;
      };

      // ดึง email จาก ID token (JWT) ถ้ามี
      let email: string | null = null;
      if (tokenParams?.id_token) {
        try {
          const payload = JSON.parse(
            Buffer.from(tokenParams.id_token.split('.')[1], 'base64url').toString(),
          );
          email = payload.email ?? null;
        } catch {}
      }

      // ถ้าไม่มี email ให้สร้าง unique email จาก LINE user ID
      const finalEmail = email ?? `line_${profile.userId}@pethubthai.com`;

      const user = await this.authService.findOrCreateOAuthUser(
        AuthProvider.LINE,
        profile.userId,
        finalEmail,
        profile.displayName,
        profile.pictureUrl,
      );

      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
