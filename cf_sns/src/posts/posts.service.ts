// service파일에 로직 구현, controller에서는 불러오기
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
    private readonly postsRepository: Repository<PostsModel>
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author']
    });
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

  createPost(authorId: number, postDto: CreatePostDto) {
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

    const newPost = this.postsRepository.save(post);

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
