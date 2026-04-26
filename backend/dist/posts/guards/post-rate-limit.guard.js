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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../../entities/post.entity");
let PostRateLimitGuard = class PostRateLimitGuard {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const postsToday = await this.postRepository.count({
            where: {
                userId: user.id,
                createdAt: (0, typeorm_2.MoreThanOrEqual)(today),
            },
        });
        if (postsToday >= 3) {
            throw new common_1.HttpException('You have reached the daily limit of 3 posts. Please try again tomorrow.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.PostRateLimitGuard = PostRateLimitGuard;
exports.PostRateLimitGuard = PostRateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostRateLimitGuard);
//# sourceMappingURL=post-rate-limit.guard.js.map