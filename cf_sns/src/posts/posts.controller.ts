// controller는 service에서 로직, 기능 구현한거 불러와서 사용
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { PostsService } from './posts.service';

// 컨트롤러 첫번쨰 파라미터에는 "AppController"이라는 클래스 안에 있는 모든 엔드포인트들의 접두어를 붙이는 역할, Prefix역할
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  //    모든 포스트를 다 가져온다.
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  //    id에 해당되는 post를 가져온다.
  //    ex) id=1일 경우, id가 1인 포스트를 가져온다.
  //    parameter를 url로부터 가져올껀데, 가져오려는 parameter는 id이다. 가져온 파라미터는 id라는 변수에 저장을하고, id type은 string이다.
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  // 3) POST /posts
  //    POST를 생성한다.
  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string
  ) {
    return this.postsService.createPost(authorId, title, content);
  }
  // 4) PUT /posts/:id
  //    id에 해당되는 POST를 변경한다.
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('content') content?: string
  ) {
    return this.postsService.updatePost(+id, title, content);
  }

  // 5) DELETE /posts/:id
  //    id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
