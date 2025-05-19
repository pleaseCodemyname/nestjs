// controller는 service에서 로직, 기능 구현한거 불러와서 사용
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UploadedFile
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// 컨트롤러 첫번쨰 파라미터에는 "AppController"이라는 클래스 안에 있는 모든 엔드포인트들의 접두어를 붙이는 역할, Prefix역할
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 포스트를 다 가져온다.
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
  }

  // 2) GET /posts/:id
  //    id에 해당되는 post를 가져온다.
  //    ex) id=1일 경우, id가 1인 포스트를 가져온다.
  //    parameter를 url로부터 가져올껀데, 가져오려는 parameter는 id이다. 가져온 파라미터는 id라는 변수에 저장을하고, id type은 string이다.
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  //    POST를 생성한다.
  // accessToken을 넣은 상태로 요청하면 로그인한 사용자임을 알 수 있음

  // DTO - Data Transfer Object (데이터를 전송하는 객체)
  @Post()
  @UseGuards(AccessTokenGuard)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto
    // @Body('title') title: string,
    // @Body('content') content: string
  ) {
    await this.postsService.createPostImage(body);
    return this.postsService.createPost(userId, body);
  }

  // 4) PATCH /posts/:id
  //    id에 해당되는 POST를 변경한다.
  @Patch(':id')
  putPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto
    // @Body('title') title?: string,
    // @Body('content') content?: string
  ) {
    return this.postsService.updatePost(id, body);
  }

  // 5) DELETE /posts/:id
  //    id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(+id);
  }
}
