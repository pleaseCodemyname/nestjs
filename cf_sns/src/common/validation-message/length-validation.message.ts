import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /**
   * ValidationArguments의 프로퍼티
   * 1) value -> 검증되고 있는 값(입력된 값)
   * 2) constraints -> 파라미터에 입력된 제한 사항들 (리스트로 가능)
   *    ex) args.contraints[0] -> 1 | args.contraints[1] -> 20
   * 3) targetName -> 검증하고 있는 클래스의 이름
   * 4) object -> 검증하고 있는 객체
   * 5) property -> 검증되고 있는 객체의 프로퍼티 이름
   */
  if (args.constraints.length === 2) {
    return `${args.property}은 최대 ${args.constraints[0]}~${args.constraints[1]}글자를 입력해주세요.}`;
  } else {
    return `${args.property}은 최소 ${args.constraints[0]}글자를 입력해 주세요.}`;
  }
};
