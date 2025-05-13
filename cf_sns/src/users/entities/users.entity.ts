import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20, // 1) 길이가 20을 넘지 않을 것 (최대 20)
    unique: true // 2) 유일무이한 값이 될 것 (중복되지 않아야할 것), false면 중복값 허용
  })
  nickname: string;

  @Column({
    unique: true // 1) 유일무이한 값이 될 것 (중복 X)
  })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RolesEnum), // 컬럼에서 Enum을 인지하기 위해, RolesEnum의 모든 Value값 불러오기
    default: RolesEnum.USER // 기본값 USER (create할 때, roles.enum.user값 명시안해도됨)
  })
  role: RolesEnum; // const/roles.const.ts에서 가져옴

  @OneToMany(() => PostsModel, (posts) => posts.author)
  posts: PostsModel[];
}
