import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class UserModel {
  // ID
  // @PrimaryGeneratedColumn(): 자동으로 아이디를 생성, 순서대로 위로 올라감(1, 2, 3, 4, 5)
  // @PrimaryColumn(): 기본키, 모든 테이블에서 기본적으로 존재 (중복값 X, Null값 허용 X), 테이블 안에서 각각의 Row를 구분할 수 있는 컬럼
  // @PrimaryGeneratedColumn('uuid'): asdf-1234-ㄱㄴㄷㄹ-qwer (4개의 값 조합으로 이루어져 있음)
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  title: string; // 제목

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

  @Column()
  @Generated('uuid') // @Generated('uuid')로 설정하면 타입은 string 설정, 데이터 생성마다 uuid를 이 additionalId2에다가 생성할 수 있음
  additionalId2: string;
}
