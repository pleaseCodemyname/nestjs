import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { UsersModel } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { CommonModule } from 'src/common/common.module';
import { ChatMessagesService } from './messages/messages.service';
import { MessagesModel } from './messages/entity/messages.entity';
import { MessagesController } from './messages/messages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel]),
    CommonModule
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsGateway, ChatsService, ChatMessagesService]
})
export class ChatsModule {}
