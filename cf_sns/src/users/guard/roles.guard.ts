import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Roles annotation에 대한 metadata를 가져와야한다.
     *
     * Reflector -> 관련 있는 annotation을 다 가져오되 가장 가까이에 있는 값으로 오버라이드(덮어 씌운다)
     * getAllAndOverride()
     */
    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    // Roles Annotation 등록이 안되어 있을 때
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException(`토큰을 제공해주세요!`);
    }

    if (user.role !== requiredRole) {
      throw new ForbiddenException(
        `이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한이 필요합니다.`
      );
    }
    return true;
  }
}
