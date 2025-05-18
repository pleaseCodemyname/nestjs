import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  // 1) UsersModel과 연동, Foreign Key 설정
  // 2) Null이 될 수 없다.
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false
  }) // 현재 모델(posts)은 여러개고, UsersModel은 한 개 (하나의 포스트에 여러명의 작성자가 있을 수 없음)
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage
  })
  title: string;

  @Column()
  content: string;
  @IsString({
    message: stringValidationMessage
  })
  @Column({
    nullable: true // 이미지가 필수가 아님
  })
  image?: string; // image의 위치를 저장, 이미지 직접을 저장하지 않음

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
