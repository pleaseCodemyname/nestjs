import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    /**
     * 요청이 들어올 때 Req 요청이 들어온 타임스탬프를 찍는다.
     * [REQ] {요청 path} {요청 시간}
     *
     * 요청이 끝날 때 {응답이 나갈 때} 다시 타임스탬프를 찍는다.
     * [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
     */
    const now = new Date(); // 현재 날짜와 시간 가져오기

    const req = context.switchToHttp().getRequest();

    // /posts, /common/image
    const path = req.originalUrl;

    // [REQ] {요청 path} {요청 시간}
    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    // handle을 사용하면 응답 값을 가져올 수 있음, return next.handle()을 실행하는 순간 라우트의 로직이 전부 실행되고 응답이 observable로 반환된다
    // pipe를 통해서 각각의 함수가 실행됨, 함수를 지나갈 때마다 전달되는 값을 그대로 우리가 모니터링 가능(변형은 불가능)
    return next.handle().pipe(
      // [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
      tap((obserable) =>
        console.log(
          `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}`
        )
      )
    );
  }
}
