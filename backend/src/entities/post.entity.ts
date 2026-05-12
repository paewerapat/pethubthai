import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PostImage } from './post-image.entity';

export enum PetType {
  CAT = 'cat',
  DOG = 'dog',
  OTHER = 'other',
}

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum PostStatus {
  LOST = 'lost',
  FOUND = 'found',
  ADOPTED = 'adopted',
}

export enum PosterRelation {
  OWNER = 'owner',
  WITNESS = 'witness',
  OTHER = 'other',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pet_name' })
  petName: string;

  @Column({
    type: 'enum',
    enum: PetType,
    name: 'pet_type',
  })
  petType: PetType;

  @Column({ nullable: true })
  breed: string;

  @Column({
    type: 'enum',
    enum: PetGender,
    default: PetGender.UNKNOWN,
  })
  gender: PetGender;

  @Column({ nullable: true, name: 'age_estimate' })
  ageEstimate: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.LOST,
  })
  status: PostStatus;

  @Column({ type: 'date', name: 'lost_date' })
  lostDate: Date;

  @Column({ name: 'lost_location' })
  lostLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true, name: 'line_id' })
  lineId: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ name: 'poster_name' })
  posterName: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'has_reward', default: false })
  hasReward: boolean;

  @Column({ name: 'reward_amount', nullable: true })
  rewardAmount: string;

  @Column({
    type: 'enum',
    enum: PosterRelation,
    default: PosterRelation.OWNER,
    name: 'poster_relation',
  })
  posterRelation: PosterRelation;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToMany(() => PostImage, (image) => image.post, {
    cascade: true,
    eager: true,
  })
  images: PostImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
