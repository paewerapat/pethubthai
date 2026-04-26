import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const FacebookStrategy_base: new (...args: [options: import("passport-facebook").StrategyOptionsWithRequest] | [options: import("passport-facebook").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class FacebookStrategy extends FacebookStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile, done: (err: any, user?: any) => void): Promise<void>;
}
export {};
