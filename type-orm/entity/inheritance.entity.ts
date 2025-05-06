import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

// 상속(inheritance)
// @Entity 등록 안하면 테이블 생성 안됨
export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// BaseModel을 상속받아서 id, createdAt, updatedAt + name 까지 포함된 Entity 생성 가능
// BookModel: id, createdAt, updatedAt + name
@Entity()
export class BookModel extends BaseModel {
  @Column()
  name: string;
}

// CarModel: id, createdAt, updatedAt + brand
@Entity()
export class CarModel extends BaseModel {
  @Column()
  brand: string;
}

// Single Table Inheritance, base가 되는 모델(entity)도 entity로 등록
// 같은 테이블로 묶으려면 자식클래스에는는 @ChildEntity() + 부모에는 @TableInheritance()
@Entity()
@TableInheritance({
  column: {
    name: 'type', // table하나로 2개의 entity를 관리하려면(computer인지 airplane인지 구분하려면), type
    type: 'varchar',
  },
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  brand: string;
}

@ChildEntity()
export class AirplaneModel extends SingleBaseModel {
  @Column()
  country: string;
}
