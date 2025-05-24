import { BadRequestException, Injectable } from '@nestjs/common';
import { read } from 'fs';
import { CommonService } from 'src/common/common.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comments.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Injectable()
export class CommentsService {
  @InjectRepository(CommentsModel)
  private readonly commentsRepository: Repository<CommentsModel>;
  constructor(private readonly commonService: CommonService) {}

  paginateComments(dto: PaginateCommentsDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        ...DEFAULT_COMMENT_FIND_OPTIONS
      },
      `posts/${postId}/comments`
    );
  }
  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: {
        id
      }
    });
    if (!comment) {
      throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
    }
    return comment;
  }

  async createComment(
    dto: CreateCommentDto,
    postId: number,
    author: UsersModel
  ) {
    return this.commentsRepository.save({
      ...dto,
      post: {
        id: postId
      },
      author
    });
  }

  async updateComment(dto: UpdateCommentsDto, commentId: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId
      }
    });
    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }
    const prevComment = await this.commentsRepository.preload({
      id: commentId,
      ...dto
    });
    const newComment = await this.commentsRepository.save(prevComment);
    return newComment;
  }

  async deleteComment(id: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id
      }
    });
    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }
    await this.commentsRepository.delete(id);

    return id;
  }

  async isCommentMine(userId: number, commentId: number) {
    return this.commentsRepository.exist({
      where: {
        id: commentId,
        author: {
          id: userId
        }
      },
      relations: {
        author: true
      }
    });
  }
}
