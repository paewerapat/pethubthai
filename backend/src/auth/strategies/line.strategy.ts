import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../../entities/user.entity';

// LINE requires `state` param. Without sessions we use a stateless store:
// generates a random state for the redirect, always verifies as valid on callback.
const statelessStore = {
  store: (_req: any, cb: any) => cb(null, Math.random().toString(36).slice(2)),
  verify: (_req: any, _state: any, cb: any) => cb(null, true),
} as any;

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
  ): Promise<any> {
    const res = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const lineProfile = (await res.json()) as {
      userId: string;
      displayName: string;
      pictureUrl?: string;
    };

    let email: string | null = null;
    if (tokenParams?.id_token) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParams.id_token.split('.')[1], 'base64url').toString(),
        );
        email = payload.email ?? null;
      } catch {}
    }

    const finalEmail = email ?? `line_${lineProfile.userId}@pethubthai.com`;

    return this.authService.findOrCreateOAuthUser(
      AuthProvider.LINE,
      lineProfile.userId,
      finalEmail,
      lineProfile.displayName,
      lineProfile.pictureUrl,
    );
  }
}
