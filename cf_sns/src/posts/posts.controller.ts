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
  UploadedFile,
  InternalServerErrorException,
  UseFilters,
  HttpException,
  BadRequestException
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { RolesEnum } from 'src/users/const/roles.const';
import { Roles } from 'src/users/decorator/roles.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

// 컨트롤러 첫번쨰 파라미터에는 "AppController"이라는 클래스 안에 있는 모든 엔드포인트들의 접두어를 붙이는 역할, Prefix역할
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsImageService: PostsImagesService,
    private readonly dataSource: DataSource
  ) {}

  // 1) GET /posts
  // 모든 포스트를 다 가져온다.
  @Get()
  @IsPublic()
  // @UseInterceptors(LogInterceptor)
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
  @IsPublic()
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  //    POST를 생성한다.
  // accessToken을 넣은 상태로 요청하면 로그인한 사용자임을 알 수 있음

  // DTO - Data Transfer Object (데이터를 전송하는 객체)
  // A Model, B Model
  // Post API -> A Model을 저장하고, B 모델을 저장한다.
  // await repository.save(a);
  // await repository.save(b);

  // 만약에 a를 저장하다가 실패하면 b를 저장하면 안될 경우
  // transaction: all or nothing(모두 실행되거나, 아님 전부 실행되지 않거나)
  // start -> 시작
  // commit -> 저장
  // rollback -> 원상 복구

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR
  ) {
    // 로직 실행 (image가 아무것도 없는 상태에서 포스트 생성)
    const post = await this.postsService.createPost(userId, body, qr);

    // image 생성
    for (let i = 0; i < body.images.length; i++) {
      await this.postsImageService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE
        },
        qr
      );
    }
    return this.postsService.getPostById(post.id, qr);
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
  @Roles(RolesEnum.ADMIN)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(+id);
  }

  // RBAC -> Role Based Access Control(역할 기반 접근 제어)
}
