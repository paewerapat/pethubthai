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
exports.Post = exports.PosterRelation = exports.PostStatus = exports.PetGender = exports.PetType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const post_image_entity_1 = require("./post-image.entity");
var PetType;
(function (PetType) {
    PetType["CAT"] = "cat";
    PetType["DOG"] = "dog";
    PetType["OTHER"] = "other";
})(PetType || (exports.PetType = PetType = {}));
var PetGender;
(function (PetGender) {
    PetGender["MALE"] = "male";
    PetGender["FEMALE"] = "female";
    PetGender["UNKNOWN"] = "unknown";
})(PetGender || (exports.PetGender = PetGender = {}));
var PostStatus;
(function (PostStatus) {
    PostStatus["LOST"] = "lost";
    PostStatus["FOUND"] = "found";
    PostStatus["ADOPTED"] = "adopted";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var PosterRelation;
(function (PosterRelation) {
    PosterRelation["OWNER"] = "owner";
    PosterRelation["WITNESS"] = "witness";
    PosterRelation["OTHER"] = "other";
})(PosterRelation || (exports.PosterRelation = PosterRelation = {}));
let Post = class Post {
    id;
    petName;
    petType;
    breed;
    gender;
    ageEstimate;
    status;
    lostDate;
    lostLocation;
    latitude;
    longitude;
    description;
    phoneNumber;
    lineId;
    facebook;
    instagram;
    posterName;
    posterRelation;
    user;
    userId;
    images;
    createdAt;
    updatedAt;
};
exports.Post = Post;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pet_name' }),
    __metadata("design:type", String)
], Post.prototype, "petName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PetType,
        name: 'pet_type',
    }),
    __metadata("design:type", String)
], Post.prototype, "petType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "breed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PetGender,
        default: PetGender.UNKNOWN,
    }),
    __metadata("design:type", String)
], Post.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'age_estimate' }),
    __metadata("design:type", String)
], Post.prototype, "ageEstimate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PostStatus,
        default: PostStatus.LOST,
    }),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'lost_date' }),
    __metadata("design:type", Date)
], Post.prototype, "lostDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lost_location' }),
    __metadata("design:type", String)
], Post.prototype, "lostLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Post.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Post.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number' }),
    __metadata("design:type", String)
], Post.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'line_id' }),
    __metadata("design:type", String)
], Post.prototype, "lineId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "facebook", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "instagram", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'poster_name' }),
    __metadata("design:type", String)
], Post.prototype, "posterName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PosterRelation,
        default: PosterRelation.OWNER,
        name: 'poster_relation',
    }),
    __metadata("design:type", String)
], Post.prototype, "posterRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.posts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Post.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Post.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_image_entity_1.PostImage, (image) => image.post, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Post.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)('posts')
], Post);
//# sourceMappingURL=post.entity.js.map