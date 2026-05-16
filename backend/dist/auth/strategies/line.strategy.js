"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_oauth2_1 = require("passport-oauth2");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
const user_entity_1 = require("../../entities/user.entity");
let LineStrategy = class LineStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'line') {
    configService;
    authService;
    constructor(configService, authService) {
        super({
            authorizationURL: 'https://access.line.me/oauth2/v2.1/authorize',
            tokenURL: 'https://api.line.me/oauth2/v2.1/token',
            clientID: configService.get('LINE_CHANNEL_ID'),
            clientSecret: configService.get('LINE_CHANNEL_SECRET'),
            callbackURL: configService.get('LINE_CALLBACK_URL'),
            scope: ['profile', 'openid', 'email'],
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(accessToken, _refreshToken, tokenParams, _profile, done) {
        try {
            const res = await fetch('https://api.line.me/v2/profile', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const profile = (await res.json());
            let email = null;
            if (tokenParams?.id_token) {
                try {
                    const payload = JSON.parse(Buffer.from(tokenParams.id_token.split('.')[1], 'base64url').toString());
                    email = payload.email ?? null;
                }
                catch { }
            }
            const finalEmail = email ?? `line_${profile.userId}@pethubthai.com`;
            const user = await this.authService.findOrCreateOAuthUser(user_entity_1.AuthProvider.LINE, profile.userId, finalEmail, profile.displayName, profile.pictureUrl);
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    }
};
exports.LineStrategy = LineStrategy;
exports.LineStrategy = LineStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], LineStrategy);
//# sourceMappingURL=line.strategy.js.map