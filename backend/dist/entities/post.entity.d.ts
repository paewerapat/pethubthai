import { User } from './user.entity';
import { PostImage } from './post-image.entity';
export declare enum PetType {
    CAT = "cat",
    DOG = "dog",
    OTHER = "other"
}
export declare enum PetGender {
    MALE = "male",
    FEMALE = "female",
    UNKNOWN = "unknown"
}
export declare enum PostStatus {
    LOST = "lost",
    FOUND = "found",
    ADOPTED = "adopted",
    AVAILABLE = "available"
}
export declare enum PostCategory {
    LOST = "lost",
    ADOPTION = "adoption"
}
export declare enum PosterRelation {
    OWNER = "owner",
    WITNESS = "witness",
    OTHER = "other"
}
export declare class Post {
    id: string;
    petName: string;
    petType: PetType;
    breed: string;
    gender: PetGender;
    ageEstimate: string;
    status: PostStatus;
    category: PostCategory;
    lostDate: Date;
    lostLocation: string;
    latitude: number;
    longitude: number;
    description: string;
    phoneNumber: string;
    lineId: string;
    facebook: string;
    instagram: string;
    posterName: string;
    viewCount: number;
    hasReward: boolean;
    rewardAmount: string;
    posterRelation: PosterRelation;
    user: User;
    userId: string;
    images: PostImage[];
    createdAt: Date;
    updatedAt: Date;
}
