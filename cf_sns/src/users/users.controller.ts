import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesEnum } from './const/roles.const';
import { Roles } from './decorator/roles.decorator';
import { UsersModel } from './entity/users.entity';
import { User } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  /**
   * serialization -> 직렬화: 현재 시스템에서 사용되는(NestJS) 데이터의 구조를 다른 시스템에서도 쉽게 사용할 수 있는 포맷으로 변환 --> class의 object에서 JSON 포맷으로 변환
   * deserialization -> 역직렬화
   */
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('follow/me')
  async getFollow(@User() user: UsersModel) {
    return this.usersService.getFollowers(user.id);
  }

  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number
  ) {
    await this.usersService.followUser(user.id, followeeId);
    return true;
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
