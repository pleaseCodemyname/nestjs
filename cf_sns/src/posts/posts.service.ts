// service파일에 로직 구현, controller에서는 불러오기
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import {
  ENV_DB_HOST_KEY,
  ENV_PROTOCOL_KEY
} from 'src/common/const/env-keys.const';
import { ConfigService } from '@nestjs/config';
import {
  POST_IMAGE_PATH,
  PUBLIC_FOLDER_NAME,
  PUBLIC_FOLDER_PATH,
  TEMP_FOLDER_PATH
} from 'src/common/const/path.const';
import { basename, join } from 'path';
import { promises } from 'fs';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

// Post 인터페이스 생성
export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

// PostModel을 List로[]
let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '화장 고치고 있는 민지',
    likeCount: 1000000,
    commentCount: 777777
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래 연습하고 있는 해린',
    likeCount: 1000000,
    commentCount: 777777
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 로제',
    content: '종합운동장에서 공영중인 로제',
    likeCount: 1000000,
    commentCount: 777777
  }
];

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

// Provider에 Injectable이라고 명시해줘야 프로바이더로 사용할 수 있다.
// 프로바이더로 사용하고 싶은 클래스는 모듈에다가 등록해주고 Injectable로 Annotation해주기(posts.service.ts)

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author']
    });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`
      });
    }
  }

  // 1) 오름차 순으로 정렬하는 pagination만 구현한다.
  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      {
        relations: ['author']
      },
      'posts'
    );
    // if (dto.page) {
    //   return this.pagePaginatePosts(dto);
    // } else {
    //   return this.cursorPaginatePosts(dto);
    // }
  }

  async pagePaginatePosts(dto: PaginatePostDto) {
    /**
     * data: Data[],
     * total: number,
     *
     * [1] [2] [3] [4]
     */
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: dto.take * (dto.page - 1), // 2페이지 일 때 2-1 = 1(20)개 스킵
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt
      }
    });
    return {
      data: posts,
      total: count
    };
  }

  async cursorPaginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id__less_than) {
      /**
       * id: LessThan(dto.where__id_less_than);
       */
      where.id = LessThan(dto.where__id__less_than);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than);
    }

    // 1, 2, 3, 4, 5
    const posts = await this.postsRepository.find({
      where,
      // order__createdAt
      order: {
        createdAt: dto.order__createdAt // 오름차순 정렬
      },
      take: dto.take // 20개
    });

    // 해당되는 포스트가 0개 이상이면 마지막 포스트를 가져오고, 아니면 null을 반환한다.
    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_DB_HOST_KEY);

    const nextUrl = lastItem && new URL(`${protocol}://${host}/posts`);

    if (nextUrl) {
      /**
       * dto의 키값들을 루핑하면서 키값에 해당되는 벨류가 존재하면 param에 그대로 붙여넣는다.
       * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }
      // where_id__more_than이 query에 넣어주지 않은 경우 자동으로 추가됨
      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    /**
     * Response
     *
     * data: Data[],
     * cursor: {
     *  after: 마지막 Data의 ID
     * ,
     * count: 응답한 데이터의 갯수
     * next: 다음 요청을 할 때 사용할 URL
     */
    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null
      },
      count: posts.length,
      next: nextUrl?.toString() ?? null
    };
  }
  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id // id: id
      },
      relations: ['author']
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async createPostImage(dto: CreatePostDto) {
    // dto의 이미지 이름을 기반으로 파일의 경로를 생성한다.
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.image);
    try {
      // promises: 파일 존재하는지 확인 (nodejs 기본 기능), 만약 존재하지 않는다면 에러 던짐
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('존재하지 않는 파일 입니다.');
    }
    // 파일의 이름만 가져오기 ex) /Users/aaa/abcd.jpg => abcd.jpg
    const fileName = basename(tempFilePath);

    // 새로 이동할 포스트 폴더의 경로 + 이미지 이름
    // {프로젝트경로}/public/posts/abcd.jpg
    const newPath = join(POST_IMAGE_PATH, fileName);

    // 파일 옮기기
    await promises.rename(tempFilePath, newPath);

    return true;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)

    // id가 존재하지 않는 이유는 DB에서 자동으로 생성해주기 떄문이다.
    const post = this.postsRepository.create({
      // 어떤 author랑 연결할지 입력해야함
      author: {
        id: authorId // UsersModel의 id값, UsersModel
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;

    // save의 기능
    // 1)  만약 데이터가 존재하지 않는다면(id 기준으로) 새로 생성
    // 2) 같은 id가 존재하면, 존재하던 값을 업데이트 한다.
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      }
    });

    if (!post) {
      throw new NotFoundException();
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      }
    });
    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }
}
