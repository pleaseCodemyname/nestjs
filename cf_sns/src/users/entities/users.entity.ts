import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

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
}
