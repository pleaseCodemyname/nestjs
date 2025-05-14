import { IsString } from 'class-validator';
import { PostsModel } from '../entities/posts.entity';
import { PickType } from '@nestjs/mapped-types';

export class createPostDto extends PickType(PostsModel, ['title', 'content']) {}
