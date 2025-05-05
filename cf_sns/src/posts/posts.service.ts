// service파일에 로직 구현, controller에서는 불러오기
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id // id: id
      }
    });
    if (!post) {
      throw new NotFoundException();
    }
  }

  createPost(author: string, title: string, content: string) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author, // author : author
      title,
      content,
      likeCount: 0,
      commentCount: 0
    };

    posts = [...posts, post];
    return post;
  }
  updatePost(postId: number, author: string, title: string, content: string) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      throw new NotFoundException();
    }
    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    posts = posts.map((prevPost) =>
      prevPost.id === +postId ? post : prevPost
    );

    return post;
  }
  deletePost(postId: number) {
    const post = posts.find((post) => post.id === postId);
    if (!post) {
      throw new NotFoundException();
    }
    posts = posts.filter((post) => post.id !== postId);

    return postId;
  }
}
