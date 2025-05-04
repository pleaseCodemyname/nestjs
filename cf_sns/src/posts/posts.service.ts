import { Injectable } from '@nestjs/common';

// Provider에 Injectable이라고 명시해줘야 프로바이더로 사용할 수 있다.
// 프로바이더로 사용하고 싶은 클래스는 모듈에다가 등록해주고 Injectable로 Annotation해주기(posts.service.ts)
@Injectable()
export class PostsService {}
