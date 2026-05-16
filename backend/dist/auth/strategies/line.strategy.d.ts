import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const LineStrategy_base: new (...args: [options: import("passport-oauth2").StrategyOptionsWithRequest] | [options: import("passport-oauth2").StrategyOptions]) => import("passport-oauth2") & {
    validate(...args: any[]): unknown;
};
export declare class LineStrategy extends LineStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(accessToken: string, _refreshToken: string, tokenParams: any, _profile: any): Promise<any>;
}
export {};
