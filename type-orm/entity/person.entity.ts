import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entity Embedding
// Name 클래스는 Entity로 선언하지 말기
// student_model: id, class, nameFirst, nameLast | teacher_model: id, salary, nameFirst, nameLast
// 새로운 클래스에 중복되는 프로퍼티 등록(Entity 선언 X), 다른 Property에 등록

export class Name {
  @Column()
  first: string;
  @Column()
  last: string;
}

// id, firstName, lastName 중복
@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  class: string;
}

@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;
}
