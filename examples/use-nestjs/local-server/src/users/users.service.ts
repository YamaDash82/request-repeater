import { Injectable } from '@nestjs/common';

export class User {
  userId: number;
  userName: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    { userId: 1, userName: '山田　太郎' }, 
    { userId: 2, userName: '山田　花子' }, 
    { userId: 3, userName: '佐藤　二朗' }, 
  ];

  fetchUserList(): User[] {
    return this.users;
  }

  findUser(query: { userId: number }): User | null {
    const parsedUserId = parseInt(query.userId.toString());
    return this.users.find(user => user.userId === parsedUserId) || null;
  }
}
