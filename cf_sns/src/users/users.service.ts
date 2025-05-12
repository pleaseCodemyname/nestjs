import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>
  ) {}

  // 1. 유저 생성
  async createUser(nickname: string, email: string, password: string) {
    const user = this.usersRepository.create({
      nickname,
      email,
      password
    });
    const newUser = this.usersRepository.save(user);

    return newUser;
  }

  // 2. 모든 유저 조회
  async getAllUsers() {
    return this.usersRepository.find();
  }

  // 3. 유저가 존재하는지 확인(email)
  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email
      }
    });
  }
}
