import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../../entities/user.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID') as string,
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') as string,
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') as string,
      scope: ['email'],
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      enableProof: true,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const email = profile.emails?.[0]?.value ?? `${profile.id}@facebook.com`;
    const avatar = profile.photos?.[0]?.value;

    return this.authService.findOrCreateOAuthUser(
      AuthProvider.FACEBOOK,
      profile.id,
      email,
      profile.displayName,
      avatar,
    );
  }
}
