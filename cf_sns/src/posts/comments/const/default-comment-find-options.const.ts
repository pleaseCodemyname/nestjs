import { FindManyOptions } from 'typeorm';
import { CommentsModel } from '../entity/comment.entity';

export const DEFAULT_COMMENT_FIND_OPTIONS: FindManyOptions<CommentsModel> = {
  relations: {
    author: true
  },
  select: {
    author: {
      id: true,
      nickname: true
    }
  }
};
