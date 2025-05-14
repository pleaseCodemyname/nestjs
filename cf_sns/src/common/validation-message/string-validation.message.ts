import { ValidationArguments } from 'class-validator';

export const stringValidationMessage = (args: ValidationArguments) => {
  return `${args.property}에 String 타입을 입력해주세요.`;
};
