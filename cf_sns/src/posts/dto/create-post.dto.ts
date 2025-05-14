import { IsString } from 'class-validator';

export class createPostDto {
  @IsString() // string이 아니면 에러
  title: string;

  @IsString() // string이 아니면 에러
  content: string;
}
