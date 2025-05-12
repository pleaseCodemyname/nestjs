import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}

// 사용자 생성하는 API는 auth 모듈에서만 전부 다 관리(인증과 검증로직이 필요하기 때문)
// @Post()
// postUser(
//   @Body('nickname') nickname: string,
//   @Body('email') email: string,
//   @Body('password') password: string
// ) {
//   // 이전 버전
//   // return this.usersService.createUser(nickname, email, password);
//   // 새로운 버전 파라미터를 user: Pick<UsersModel, 'email' | 'nickname' | 'password'>)로 바꿨으니깐 object(객체{}로 변경해야함)
//   return this.usersService.createUser({
//     nickname,
//     email,
//     password
//   });
// }
