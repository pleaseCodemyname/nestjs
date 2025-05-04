import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

// 프로바이더로 사용하고 싶은 클래스는 모듈에다가 등록해주고 Injectable로 Annotation해주기(posts.service.ts)

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
