import { IsString } from 'class-validator';
import { ChatsModel } from 'src/chats/entity/chats.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class MessagesModel extends BaseModel {
  // 여러개의 메시지가 하나의 채팅방에 연결되니깐 ManyToOne
  @ManyToOne(() => ChatsModel, (chat) => chat.messages)
  chat: ChatsModel;

  // 누가 보낸 것인지 알아야 하기 때문에, 한 사용자가 여러개 메시지를 보낼 수 있으니 ManyToOne, 하나의 메시지가 여러사용자가 보낸 것일수는 없음
  @ManyToOne(() => UsersModel, (user) => user.messages)
  author: UsersModel;

  @Column()
  @IsString()
  message: string;
}
