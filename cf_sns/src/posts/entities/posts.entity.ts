import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
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
    message: 'title은 string 타입을 입력해줘야 합니다.'
  })
  title: string;

  @Column()
  content: string;
  @IsString({
    message: 'content는 string 타입을 입력해줘야 합니다.'
  })
  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
