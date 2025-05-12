import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  postUser(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    // 이전 버전
    // return this.usersService.createUser(nickname, email, password);
    // 새로운 버전 파라미터를 user: Pick<UsersModel, 'email' | 'nickname' | 'password'>)로 바꿨으니깐 object(객체{}로 변경해야함)
    return this.usersService.createUser({
      nickname,
      email,
      password
    });
  }

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
