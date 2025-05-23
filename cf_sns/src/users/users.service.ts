import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>
  ) {}

  // 1. 유저 생성 (이전버전)
  // async createUser(nickname: string, email: string, password: string) {
  //   const user = this.usersRepository.create({
  //     nickname,
  //     email,
  //     password
  //   });
  //   const newUser = this.usersRepository.save(user);

  //   return newUser;
  // }

  // 1. 유저 생성 (새로운 버전)
  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    // 생성 시 사용자를 생성하는 작업은 항상 닉네임과 이메일이 중복되지 않는지 확인해줘야함
    // 1) nickname 중복 확인
    // exist() -> 만약제 조건에 해당되는 값이 있으면 true 바노한
    const nicknameExists = await this.usersRepository.exist({
      where: {
        nickname: user.nickname
      }
    });
    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 nickname 입니다!');
    }

    const emailExists = await this.usersRepository.exist({
      where: {
        email: user.email
      }
    });

    if (emailExists) {
      throw new BadRequestException('이미 가입한 이메일 입니다!');
    }

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password
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
