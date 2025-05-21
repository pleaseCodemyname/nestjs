import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../const/roles.const';

export const ROLES_KEY = 'user_roles';

// @Roles(RolesEnum.ADMIN) -> ADMIN 사용자만 가능
export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);
