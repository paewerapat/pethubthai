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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../entities/post.entity");
const post_image_entity_1 = require("../entities/post-image.entity");
let PostsService = class PostsService {
    postRepository;
    postImageRepository;
    constructor(postRepository, postImageRepository) {
        this.postRepository = postRepository;
        this.postImageRepository = postImageRepository;
    }
    async create(createPostDto, user) {
        const { images, ...postData } = createPostDto;
        const post = this.postRepository.create({
            ...postData,
            userId: user.id,
        });
        const savedPost = await this.postRepository.save(post);
        if (images && images.length > 0) {
            const postImages = images.map((img) => this.postImageRepository.create({
                ...img,
                postId: savedPost.id,
            }));
            await this.postImageRepository.save(postImages);
        }
        return this.findOne(savedPost.id);
    }
    async findAll(page = 1, limit = 10, status, petType, province, amphoe, tambon) {
        const query = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.images', 'images')
            .leftJoinAndSelect('post.user', 'user')
            .orderBy('post.createdAt', 'DESC');
        if (status) {
            query.andWhere('post.status = :status', { status });
        }
        if (petType) {
            query.andWhere('post.petType = :petType', { petType });
        }
        if (tambon) {
            query.andWhere('post.lostLocation LIKE :tambon', { tambon: `%${tambon}%` });
        }
        else if (amphoe) {
            query.andWhere('post.lostLocation LIKE :amphoe', { amphoe: `%${amphoe}%` });
        }
        else if (province) {
            query.andWhere('post.lostLocation LIKE :province', { province: `%${province}%` });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['images', 'user'],
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async update(id, updatePostDto, user) {
        const post = await this.findOne(id);
        if (post.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own posts');
        }
        const dto = updatePostDto;
        const { images, ...postData } = dto;
        Object.assign(post, postData);
        await this.postRepository.save(post);
        if (images) {
            await this.postImageRepository.delete({ postId: id });
            if (images.length > 0) {
                const postImages = images.map((img) => this.postImageRepository.create({
                    ...img,
                    postId: id,
                }));
                await this.postImageRepository.save(postImages);
            }
        }
        return this.findOne(id);
    }
    async remove(id, user) {
        const post = await this.findOne(id);
        if (post.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.postRepository.remove(post);
    }
    async incrementView(id) {
        await this.postRepository.increment({ id }, 'viewCount', 1);
    }
    async findByUser(userId) {
        return this.postRepository.find({
            where: { userId },
            relations: ['images'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(post_image_entity_1.PostImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map