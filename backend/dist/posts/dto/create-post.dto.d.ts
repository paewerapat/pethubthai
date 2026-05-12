import { PetType, PetGender, PostStatus, PosterRelation } from '../../entities/post.entity';
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
    lostDate: string;
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
