import { IsObject, IsOptional, IsString } from 'class-validator';
import { PostsModel } from '../entity/posts.entity';
import { PickType } from '@nestjs/mapped-types';

// Pick, Omit, Partial -> Type 반환
// Picktype, OmitType, PartialTpe -> 값 반환

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  @IsString({
    each: true
  })
  @IsOptional()
  images: string[] = [];
}
