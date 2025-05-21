import { PickType } from '@nestjs/mapped-types';
import { MessagesModel } from '../entity/messages.entity';
import { IsNull } from 'typeorm';
import { IsNumber } from 'class-validator';

export class CreateMessagesDto extends PickType(MessagesModel, ['message']) {
  @IsNumber()
  chatId: number;
}
