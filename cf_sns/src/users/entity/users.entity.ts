import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entity/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  ValidationArguments
} from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude, Expose } from 'class-transformer';
import { ChatsModel } from 'src/chats/entity/chats.entity';
import { MessagesModel } from 'src/chats/messages/entity/messages.entity';
import { CommentsModel } from 'src/posts/comments/entity/comment.entity';
import { UserFollowersModel } from './user-followers.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20, // 1) 길이가 20을 넘지 않을 것 (최대 20)
    unique: true // 2) 유일무이한 값이 될 것 (중복되지 않아야할 것), false면 중복값 허용
  })
  @IsString({
    message: stringValidationMessage
  })
  @Length(1, 20, {
    message: lengthValidationMessage
  })
  // 1) 길이가 20을 넘지 않을 것
  // 2) 유일무이한 값이 될 것 (Unique)
  nickname: string;

  @Column({
    unique: true // 1) 유일무이한 값이 될 것 (중복 X)
  })
  @IsString({
    message: stringValidationMessage
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage
    }
  ) // Email인지 Validator
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage
  })
  @Length(3, 8, {
    message: lengthValidationMessage
  }) // auth.controller.ts에서 @Body('password', new MaxLengthPipe(8, '비밀번호'), new MinLengthPipe(3)) 이걸 annotation으로 줄인 것

  /**
   * Request
   * frontend -> backend
   * plain object (JSON) -> class instance (dto)
   *
   * Response
   * backend -> frontend
   * class instance (dto) -> plain object (JSON)
   *
   * toClassOnly -> class instance로 변환될때만 (요청)
   * toPlainOnly -> plain object로 변환될때만 (응답)
   */
  @Exclude({
    toPlainOnly: true // 응답이 나갈때만 exclude를 시켜야함
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum), // 컬럼에서 Enum을 인지하기 위해, RolesEnum의 모든 Value값 불러오기
    default: RolesEnum.USER // 기본값 USER (create할 때, roles.enum.user값 명시안해도됨)
  })
  role: RolesEnum; // const/roles.const.ts에서 가져옴

  @OneToMany(() => PostsModel, (posts) => posts.author)
  posts: PostsModel[];

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel;

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];

  // 내가 팔로우 하는 사람들
  @OneToMany(() => UserFollowersModel, (ufm) => ufm.follower)
  followers: UserFollowersModel[];

  // 나를 팔로우 하고 있는 사람들
  @OneToMany(() => UserFollowersModel, (ufm) => ufm.followee)
  followees: UserFollowersModel[];
}
