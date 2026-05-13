import { PetType, PetGender, PostStatus, PostCategory, PosterRelation } from '../../entities/post.entity';
declare class ImageDto {
    imageUrl: string;
    order: number;
}
export declare class CreatePostDto {
    petName: string;
    petType: PetType;
    breed?: string;
    gender?: PetGender;
    ageEstimate?: string;
    status?: PostStatus;
    category?: PostCategory;
    lostDate?: string;
    lostLocation: string;
    latitude: number;
    longitude: number;
    description?: string;
    phoneNumber: string;
    lineId?: string;
    facebook?: string;
    instagram?: string;
    hasReward?: boolean;
    rewardAmount?: string;
    posterName: string;
    posterRelation?: PosterRelation;
    images: ImageDto[];
}
export {};
