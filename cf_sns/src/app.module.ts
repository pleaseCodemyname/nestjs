import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule], // 다른 모듈을 불러올 때 사용
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
