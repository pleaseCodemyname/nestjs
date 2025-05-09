import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel {
  @PrimaryGeneratedColumn() // 이렇게 지정을 해주면 DB에서 id가 하나씩 증가하게 PK로 배정을 해줌
  id: number;

  // 1) UsersModel과 연동, Foreign Key 설정
  // 2) Null이 될 수 없다.
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false
  }) // 현재 모델(posts)은 여러개고, UsersModel은 한 개 (하나의 포스트에 여러명의 작성자가 있을 수 없음)
  author: UsersModel;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  likeCount: number;
  @Column()
  commentCount: number;
}
