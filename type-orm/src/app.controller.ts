import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from 'entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ProfileModel } from 'entity/porfile.entity';
import { PostModel } from 'entity/post.entity';
import { TagModel } from 'entity/tag.entity';
import { equal } from 'assert';
import { min } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - DB에 저장을 안함, user1의 type: UserModel
    //   const user1 = this.userRepository.create({
    //     email: 'test@codefactory.ai',
    //   });
    //   return user1; // 객체를 생성은 하지만 DB에 저장은 안한다.
    // }

    // 저장
    //   const user2 = await this.userRepository.save({
    //     email: 'test@codefactory.ai', // id: 101
    //   });

    //   return user2;
    // }

    // preload: 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고 추가 입력된 값으로 DB에서 가져온 값들을 대체하지만, 저장하지는 않음
    //   const user3 = await this.userRepository.preload({
    //     id: 302, // 가져올 값
    //     email: 'codefacotry@codefactory.ai', // 추가 입력된 값
    //   });
    //   return user3;
    // }

    //   // 삭제하기
    //   await this.userRepository.delete(302);
    //   return true;
    // }

    // 값을 증가시킴(increment)
    //   await this.userRepository.increment(
    //     {
    //       id: 3, // id가 1이면
    //     },
    //     'count', // count 프로퍼티를 2만큼 증가
    //     100,
    //   );
    //   return true;
    // }

    // 값을 감소시킴(decrement)
    //   await this.userRepository.decrement(
    //     {
    //       id: 1,
    //     },
    //     'count',
    //     1,
    //   );
    // }

    // 갯수 카운팅
    //   const count = await this.userRepository.count({
    //     where: {
    //       email: ILike('%0%'), // email에 0이 포함된 갯수: 10개
    //     },
    //   });
    //   return count;
    // }

    // sum(어떤 프로퍼티를 합칠 것인지 입력 => 'count')
    //   const sum = await this.userRepository.sum('count', {
    //     id: LessThan(4),
    //   });
    //   return sum;
    // }

    // average
    //   const average = await this.userRepository.average('count', {
    //     id: LessThan(4),
    //   });
    //   return average;
    // }

    // 최소값
    //   const min = await this.userRepository.minimum('count', {
    //     id: LessThan(4),
    //   });
    //   return min;
    // }

    // 최대값
    //   const max = await this.userRepository.maximum('count', {
    //     id: LessThan(4),
    //   });
    //   return max;
    // }

    // 모든 사용자 다 찾기
    // const users = await this.userRepository.find({});

    // 하나의 사용자 찾기
    // const userOne = await this.userRepository.findOne({
    //   where: {
    //     id: 3
    //   }
    // })

    // pagination: 값들을 찾고, 몇 개의 전체 값이 존재하는지 필터
    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });
    return usersAndCount; // 3개를 가져오고, 전체 값 100개가 있음을 명시함
  }

  @Post('users')
  async postUsers() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}google.com`,
      });
    }
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      order: {
        id: 'ASC',
      },
      where: {
        // id: Not(1), // 1이 아닌 경우, 1을 제외하고 가져오기 (2-100)
        // id: LessThan(30), // id가 30 전까지 가져오기 (1-29)
        // id: LessThanOrEqual(30), // id가 30보다 작거나 같은 것까지 가져오기(1-30)
        // id: MoreThan(30), // id가 30보다 큰 것 가져오기(31-100)
        // id: MoreThanOrEqual(30), // id가 30보다 크거나 같은 값 가져오기(30-100)
        // id: Equal(30), // id가 30과 같은 것
        // email: Like('%GOOGLE%'), // %google: 구글로 끝나는, google% 구글로 시작하는, %google%구글을 포함하는, 대문자GOOGLE로 하면 아무런 값도 못가져온다.
        // email: ILike('%GOOGLE%'), // 대문자 소문자 구분 안하고 모든 값 찾아옴
        // id: Between(10, 15), // id (10-15) 가져옴 (사이값)
        // id: In([1, 3, 5, 7, 99]), // id 값이 [1, 3, 5, 7, 99] 가져옴 (정확한 값)
        // id: IsNull(), // id가 null 인경우 가져옴
      },

      // 이 relations을 포함해야 get요청에서 포함되서 나왔는데, user.entity.ts에서 @onetoone에서 eager: true로 설정하니 명시안해줘도 자동으로 profile을 가져올 수 있음.
      // relations: {
      //   profile: true,
      //   posts: true,
      // },
      // 어떤 프로퍼티를 선택할지(가져올지), 기본은 모든 프로퍼티를 가져온다, 만약에 select를 정의하지 않으면, select 정의하면 정의된 프로퍼티만 가져온다.
      // select: {
      //   id: true, // id 프로퍼티를 가져온다
      //   createdAt: true, // createdAt 프로퍼티를 가져온다.
      //   updatedAt: true, // updatedAt 프로퍼티를 가져온다.
      //   version: true,
      //   profile: {
      //     id: true, // profile에서 id값만 가져옴, 원래는 jpg 파일도 있었음
      //   },
      // },
      // 필터링할 조건을 입력하게 된다.
      // where: {},
      // // id: 4, // id에 해당하는 값 가져옴, select는 해당 프로퍼티
      // version: 1,
      // id: 4, // id는 4이고, version은 1인 경우만 가져오게됨

      // id가 4이고 version이 1인 경우 [] 리스트로 제공(OR), {} 같은 객체 안에서 값을 넣는 것은 모두 And 조건으로 묶인다.
      //   {
      //     id: 3,
      //   },
      //   {
      //     version: 1,
      //   },
      // ],
      // 관계를 가져오는법
      // relations: {
      //   profile: true, // profile 프로퍼티 포함돼서 가져옴
      // },

      // 다른 where 버전
      // where: {
      //   profile: {
      //     id: 3,
      //   },
      // },
      // relations: {
      //   profile: true,
      // },

      // 오름차(ASC), 내림차 순(DESC)
      // order: {
      //   id: 'DESC',
      // },
      // // 처음 몇개를 제외할지,
      // skip: 0,
      // take: 2, // take: 1 (1개만 가져옴) | take: 2 (2개만 가져옴)
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    return this.userRepository.save({
      ...user,
      email: user.email + '0',
      // title: user.title + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async creatUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@naver.com',
      profile: {
        profileImg: 'asdf.jpg',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.jpg',
    //   user,
    // });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@naver.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'post1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    // tag에다가 post 넣는 것도 가능(여러개)
    const tag1 = await this.tagRepository.save({
      name: 'JavaScript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'TypeScript',
      posts: [post1],
    });

    // post(게시물)에 tag 넣는 것도 가능 (여러개)
    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });
    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true, // posts에서는 tags를 relation으로 가져온다.
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true, // tags에서는 posts를 relation으로 가져온다.
      },
    });
  }
}
