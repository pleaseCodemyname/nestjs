import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel {
  @PrimaryGeneratedColumn() // 이렇게 지정을 해주면 DB에서 id가 하나씩 증가하게 PK로 배정을 해줌
  id: number;
  @Column()
  author: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  likeCount: number;
  @Column()
  commentCount: number;
}
