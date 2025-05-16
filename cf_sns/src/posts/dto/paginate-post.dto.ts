import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID보다 높은 ID부터 값을 가져오기
  // @Type(() => Number) // Query문은 string으로 반환하는데, 그걸 number로 변환
  // main.ts에서 transformOptions: { enableImplicitConversion: true} 이렇게 가능
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  // 10, 9, 8 , 7
  // where__id_more_than = 7 --> 불가능
  // where__id_more_than = 7 --> 6, 5, 4, 3

  // 정렬
  // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  // 몇 개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
