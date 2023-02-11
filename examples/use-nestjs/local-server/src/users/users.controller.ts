import { Controller, Get, Query } from '@nestjs/common';
import { UsersService, User } from './users.service';

@Controller('users')
export class UsersController {
  constructor (
    private users: UsersService
  ) { }

  @Get('fetch-users-list')
  fetchUsersList(): User[] {
    return this.users.fetchUserList();
  }

  @Get('find')
  findUser(@Query() query: { userId: number }): User | null {
    return this.users.findUser(query);
  }
}
