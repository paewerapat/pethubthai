import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('event_logs')
@Index(['event', 'createdAt'])
@Index(['userId', 'createdAt'])
export class EventLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event: string; // 'post_view' | 'share_click' | 'post_create' | 'post_resolved' | 'user_register' | 'user_login' | 'page_view'

  @Column({ nullable: true, name: 'user_id' })
  userId: string;

  @Column({ nullable: true, name: 'post_id' })
  postId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // { platform: 'facebook', status: 'found', page: '/posts', ... }

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
