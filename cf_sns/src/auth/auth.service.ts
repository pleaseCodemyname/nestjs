import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService // users.module.ts에서 export를 해줘야 사용가능
  ) {}

  /**
   * 기능 구현
   * 1) registerWithEmail
   * - email, nickname, password를 입력받고 사용자 생성
   * - 생성 완료 후 accessToken & refresh Token 반환
   * - 회원 가입 후 다시 로그인해주세요 없애기
   *
   * 2) loginWithEmail
   * - email, password를 입력하면 사용자 검증 진행
   * - 검증 완료 후 accessToken&refreshToken 반화
   *
   * 3) loginUser
   * - (1)&(2)에서 필요한 access&refreshToken 반환 로직 생성
   *
   * 4) signToken
   * - (3)에서 필요한 acccess&refreshToken을 sign하는 로직
   *
   * 5) authenticateWithEmailAndPassword
   * - (2)에서 로그인 진행 시 필요한 기본적인 검증 진행
   * 1. 사용자가 존재하는지 (email)
   * 2. 비밀번호 일치 확인
   * 3. 모두 통과 시 찾은 사용자 정보 반환
   * 4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /**
   * Payload에 들어갈 정보
   * 1) email
   * 2) sub -> id (사용자의 id)
   * 3) type : 'acces' | 'refresh' 인지
   */

  // pick을 하면 이 중 택일
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access'
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      // seconds
      expiresIn: isRefreshToken ? 3600 : 300
    });
  }

  // 3. loginUser
  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accesToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true)
    };
  }

  // 5. authenticateWithEmailAndPassword
  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>
  ) {
    /**
     * 1. 사용자가 존재하는지 (email)
     * 2. 비밀번호 일치 확인
     * 3. 모두 통과 시 찾은 사용자 정보 반환
     */
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    /**
     * 파라미터
     * 1) 입력된 비밀번호
     * 2) 기존 해시 (hash) -> 사용자 정보에 저장되있는 hash
     */
    // user가 입력한 password와 사용자 정보에 저장되어 있는 hash 비번이 같은지?
    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }
    return existingUser;
  }
}
