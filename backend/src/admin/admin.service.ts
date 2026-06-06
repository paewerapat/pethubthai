import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { EventLog } from '../entities/event-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Post)  private posts: Repository<Post>,
    @InjectRepository(User)  private users: Repository<User>,
    @InjectRepository(EventLog) private events: Repository<EventLog>,
  ) {}

  async getDashboard() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last30 = new Date(today.getTime() - 29 * 86400000);

    const [
      totalPosts, totalUsers, totalLost, totalFound,
      totalAdopted, totalAvailable, todayEvents,
      newUsersToday, totalEvents,
    ] = await Promise.all([
      this.posts.count(),
      this.users.count(),
      this.posts.count({ where: { status: 'lost' as any } }),
      this.posts.count({ where: { status: 'found' as any } }),
      this.posts.count({ where: { status: 'adopted' as any } }),
      this.posts.count({ where: { status: 'available' as any } }),
      this.events.count({ where: { createdAt: MoreThanOrEqual(today) } }),
      this.users.count({ where: { createdAt: MoreThanOrEqual(today) } }),
      this.events.count(),
    ]);

    // Page views last 30 days — group by date
    const pvRows: any[] = await this.events
      .createQueryBuilder('e')
      .select("DATE_FORMAT(e.created_at, '%Y-%m-%d')", 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect("SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(e.metadata, '$.isLoggedIn')) = 'true' THEN 1 ELSE 0 END)", 'loggedIn')
      .where('e.event = :ev', { ev: 'page_view' })
      .andWhere('e.created_at >= :start', { start: last30 })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Events by type last 30 days
    const eventTypeRows: any[] = await this.events
      .createQueryBuilder('e')
      .select('e.event', 'event')
      .addSelect('COUNT(*)', 'count')
      .where('e.created_at >= :start', { start: last30 })
      .groupBy('e.event')
      .orderBy('count', 'DESC')
      .getRawMany();

    // Share clicks by platform
    const shareRows: any[] = await this.events
      .createQueryBuilder('e')
      .select("JSON_UNQUOTE(JSON_EXTRACT(e.metadata, '$.platform'))", 'platform')
      .addSelect('COUNT(*)', 'count')
      .where('e.event = :ev', { ev: 'share_click' })
      .andWhere('e.created_at >= :start', { start: last30 })
      .groupBy('platform')
      .getRawMany();

    // Recent events (last 20)
    const recentEvents = await this.events.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });

    return {
      stats: { totalPosts, totalUsers, totalLost, totalFound, totalAdopted, totalAvailable, todayEvents, newUsersToday, totalEvents },
      pageViews: pvRows,
      eventTypes: eventTypeRows,
      sharePlatforms: shareRows,
      recentEvents,
    };
  }

  async getUsers(page = 1, limit = 20, search = '') {
    const qb = this.users.createQueryBuilder('u')
      .orderBy('u.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (search) qb.where('u.name LIKE :s OR u.email LIKE :s', { s: `%${search}%` });
    const [data, total] = await qb.getManyAndCount();
    return { data: data.map(({ password, ...u }) => u), total, page, limit };
  }

  async getPosts(page = 1, limit = 20, category = '', status = '') {
    const qb = this.posts.createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'img')
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (category) qb.andWhere('p.category = :category', { category });
    if (status)   qb.andWhere('p.status = :status', { status });
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async deletePost(id: string) {
    await this.posts.delete(id);
  }

  async deleteUser(id: string) {
    await this.users.delete(id);
  }
}
