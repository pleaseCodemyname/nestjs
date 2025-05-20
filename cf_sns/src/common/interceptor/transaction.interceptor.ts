import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const qr = this.dataSource.createQueryRunner(); // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너를 실행한다.
    await qr.connect(); // 쿼리 러너에 연결 (쿼리 러너: 모든 쿼리를 한 번에 묶어주는 역할)
    await qr.startTransaction(); // 쿼리 러너에서 트랜잭션을 시작한다. 이 시점부터 같은 쿼리러너를 사용하면 트랜잭션 안에서 데이터베이스 안에서 데이터베이스 액션을 실행할 수 있다.

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();

        throw new InternalServerErrorException(e.message);
      }),
      tap(async () => {
        // commit: 정상 실행시 저장, 쿼리 러너를 사용해 실행했던 모든 DB 관련 기능이 전부 동시 실행 후 DB에 적용됨.
        await qr.commitTransaction();
        await qr.release();
      })
    );
  }
}
