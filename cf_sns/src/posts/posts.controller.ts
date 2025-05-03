import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

// Post 인터페이스 생성
interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

// 컨트롤러 첫번쨰 파라미터에는 "AppController"이라는 클래스 안에 있는 모든 엔드포인트들의 접두어를 붙이는 역할, Prefix역할
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Json 반환, @Get(데코레이터)에도 엔드포인트 명시 가능
  @Get()
  getPost(): Post {
    return {
      author: 'newjeans_official',
      title: '뉴진스 민지',
      content: '메이크업 고치고 있는 민지',
      likeCount: 1000000,
      commentCount: 7777777,
    };
  }
}
