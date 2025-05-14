import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService // users.module.ts에서 export를 해줘야 사용가능
  ) {}

  /**
   * 토큰을 사용하게 되는 방식
   * 1) 사용자가 로그인 또는 회원가입을 진행하면 accessToken과 refreshToken 발급
   * 2) 로그인 할때는 Baisc 토큰과 함께 요청을 보낸다.
   *    Basic: 토큰은 '이메일:비밀번호'를 Base64로 인코딩 형태
   *    ex) {authorization: 'Basic {token}'}
   * 3) 아무나 접근할 수 없는 정보 (private route)를 접근 할때는 aceessToken을 Header에 추가해서 요청과 함께 보낸다.
   * 4) 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   * ex) 현재 로그인한 사용자가 작성한 포스트만 가져오려면 토큰의 sub(id)값에 입력되어 있는 사용자의 포스트만 따로 필터링 가능, 특정 사용자의 토큰이 없다면 다른 사용자의 데이터에 접근 불가
   * 5) 모든 토큰은 만료기간이 있고, 만료기간이 지나면 새로 토큰을 발급받아야한다. 그렇지 않으면 jwtService.verify()에서 인증 통과가 안됨. access토큰을 새로 발급 받는 /auth/token/access와 refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가 필요함.
   * 6) 토큰이 만려되면 각각의 토큰을 새로 발급 받을 수 있는 엔트포인트에 요청을 해서 새로운 토큰 발급받고 새로운 토큰을 사용해서 priavte route에 접근한다.
   */

  /**
   * Header로 부터 토큰을 받을 때
   * {authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   */

  extractTokenFromHeader(header: string, isBearer: boolean) {
    // 'Basic {token}'
    // [Basic, {token}]
    // 'Bearer {token}'
    // [Bearer, {token}]
    const splitToken = header.split(' '); // 어떤 값으로 나눌 것인지? 띄어쓰기를 기준으로 (리스트를 나눌 수 있음)

    const prefix = isBearer ? 'Bearer' : 'Basic'; // True면 Bearer, False면 Basic

    // 띄어쓰기를 기준으로 두 개의 값만 존재해야한다.
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다');
    }

    const token = splitToken[1]; // 2번째 값(index = 1)이 토큰값일 것임

    return token;
  }

  /**
   * Basic: asdfdsaffdsa:asdfsd
   * 1) asdfdsaffdsa:asdfsd -> email:password
   * 2) email:password: -> [email, password]
   * 3) {email: email, password: password}
   */
  decodeBaiscToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

    const split = decoded.split(':'); // 컬럼 기준으로 split

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password
    };
  }

  // 토근 인증 검증
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다');
    }
  }

  // accessToken과 refreshToken을 재발급 받고 싶을 때
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, { secret: JWT_SECRET });

    /**
     * sub: id
     * email: email,
     * type: 'access' | 'refresh
     * accessToken은 재발급 불가
     */
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh 토큰으로만 가능합니다.'
      );
    }

    return this.signToken({ ...decoded }, isRefreshToken);
  }

  /**
   * 기능 구현
   * 1) registerWithEmail
   * - email, nickname, password를 입력받고 사용자 생성
   * - 생성 완료 후 accessToken & refresh Token 반환
   * - 회원 가입 후 다시 로그인해주세요 없애기
   *
   * 2) loginWithEmail
   * - email, password를 입력하면 사용자 검증 진행
   * - 검증 완료 후 accessToken&refreshToken 반환
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
      accessToken: this.signToken(user, false),
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

  /**
   * 2) loginWithEmail
   * - email, password를 입력하면 사용자 검증 진행
   * - 검증 완료 후 accessToken&refreshToken 반화
   */
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  /**
   * 1) registerWithEmail
   * - email, nickname, password를 입력받고 사용자 생성
   * - 생성 완료 후 accessToken & refresh Token 반환
   * - 회원 가입 후 다시 로그인해주세요 없애기
   */
  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(
      user.password, // 이 실제 비밀번호를 hash함.
      HASH_ROUNDS // 몇 번 해싱 돌릴껀지? Salt는 자동생성됨
    );
    // 해시가 생성이 잘 된 경우, 유저 생성
    const newUser = await this.usersService.createUser({
      ...user, // 나머지 user의 정보 불러오기
      password: hash // hash값을 비밀번호로 저장
    });

    return this.loginUser(newUser); // 회원 가입후 바로 로그인, 검증 완료 후 accessToken&refreshToken 반환
  }
}
