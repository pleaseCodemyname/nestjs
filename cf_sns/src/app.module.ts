import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';

@Module({
  // 다른 모듈을 불러올 때 사용
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      // 데이터베이스 타입
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [PostsModel],
      synchronize: true, // NestJS에서 작성하는 Type ORM 코드와 데이터베이스의 동기화를 자동으로 맞출 것인가? (개발환경에서는 True, 프로덕션 환경에서는 False)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
