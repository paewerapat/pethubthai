import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  users(
    @Query('page')   page  = '1',
    @Query('limit')  limit = '20',
    @Query('search') search = '',
  ) {
    return this.adminService.getUsers(+page, +limit, search);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('posts')
  posts(
    @Query('page')     page     = '1',
    @Query('limit')    limit    = '20',
    @Query('category') category = '',
    @Query('status')   status   = '',
  ) {
    return this.adminService.getPosts(+page, +limit, category, status);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.adminService.deletePost(id);
  }
}
