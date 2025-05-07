import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './porfile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // ID
  // @PrimaryGeneratedColumn(): 자동으로 아이디를 생성, 순서대로 위로 올라감(1, 2, 3, 4, 5)
  // @PrimaryColumn(): 기본키, 모든 테이블에서 기본적으로 존재 (중복값 X, Null값 허용 X), 테이블 안에서 각각의 Row를 구분할 수 있는 컬럼
  // @PrimaryGeneratedColumn('uuid'): asdf-1234-ㄱㄴㄷㄹ-qwer (4개의 값 조합으로 이루어져 있음)
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  email: string;

  // // 제목
  // @Column({
  //   // 데이터베이스에서 인지하는 컬럼 타입, 자동으로 유추됨
  //   type: 'varchar',
  //   // 데이터베이스 칼럼 이름, 프로퍼티 이름으로 자동 유추됨
  //   name: 'title',
  //   // 값의 길이, 입력할 수 있는 글자의 길이 300
  //   length: 300,
  //   // null이 가능한지
  //   nullable: true,
  //   // true면 처음 생성(저장)할 때만 지정 가능, 이후에는 값 변경 불가능,
  //   update: false,
  //   // find()를 실행할 때 기본으로 값을 불러올지, 기본값이 true,
  //   select: false,
  //   // 기본값, 아무것도 입력 안했을 때 기본으로 입력되게 되는 값
  //   default: 'default value',
  //   // 컬럼 중 유일무이한 값이여야하는지? unique:true는 중복된 값 방지
  //   unique: false,
  // })
  // title: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  // role: Role;
  role: string;

  // 데이터 생성일자
  // @CreatedDateColumn(): 데이터가 생성될 때마다, 그 순간에 날짜와 시간이 자동으로 찍힘
  @CreateDateColumn()
  createdAt: Date;

  // 데이터 수정일자
  // @UpdateDateColumn(): 데이터가 업데이트 될 때마다, 그 순간에 날짜와 시간이 자동으로 찍힘
  @UpdateDateColumn()
  updatedAt: Date;

  // 데이터가 업데이트 될때마다 1씩 증가, 처음 생성된 값은 1 --> 업데이트가 몇 번 되었는지 tracking 할 수 있음
  // save 함수가 몇 번 불렸는지 기억
  @VersionColumn()
  version: number;

  @Column() // @Generated는 무조건 @Column()이랑 같이 사용
  @Generated('increment') // increment: primary 컬럼은 아닌데, 데이터 생성마다 1씩 증가 | 'uuid'
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  @JoinColumn()
  profile: ProfileModel;

  // 유저 하나가 여러개의 포스트 소유, one-to-one과 many-to-one에서 무조건 many-to-one에서 아이디를 들고 있음
  @OneToMany(() => PostModel, (post) => post.author) // @JoinColumn 할 필요없음
  posts: PostModel[];
}
