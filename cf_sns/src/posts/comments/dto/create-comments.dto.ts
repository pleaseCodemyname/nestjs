import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from '../entity/comment.entity';

export class CreateCommentDto extends PickType(CommentsModel, ['comment']) {}
