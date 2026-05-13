import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PetType, PetGender, PostStatus, PostCategory, PosterRelation } from '../../entities/post.entity';

class ImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsNumber()
  order: number;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  petName: string;

  @IsEnum(PetType)
  petType: PetType;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsEnum(PetGender)
  @IsOptional()
  gender?: PetGender;

  @IsString()
  @IsOptional()
  ageEstimate?: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory;

  @IsDateString()
  @IsOptional()
  lostDate?: string;

  @IsString()
  @IsNotEmpty()
  lostLocation: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  lineId?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsBoolean()
  @IsOptional()
  hasReward?: boolean;

  @IsString()
  @IsOptional()
  rewardAmount?: string;

  @IsString()
  @IsNotEmpty()
  posterName: string;

  @IsEnum(PosterRelation)
  @IsOptional()
  posterRelation?: PosterRelation;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  images: ImageDto[];
}
