import { PermissionsToCheckType } from '../types/auth.type';
import { UnauthorizedException } from '@nestjs/common';

export function accessGuard(
  permissionsToCheck: string[],
  { user, checkObj }: PermissionsToCheckType,
): void {
  const hasAccess = checkAccess({
    permissionsToCheck,
    userId: user.id,
    checkObj,
  });

  if (!hasAccess) throw new UnauthorizedException('User access denied');

  return;
}

function checkAccess({ permissionsToCheck, userId, checkObj }): boolean {
  if (checkObj.publicUrl) {
    return true;
  }

  if (permissionsToCheck.includes('owner') && userId === checkObj.userId) {
    return true;
  }

  if (
    permissionsToCheck.includes('edit') &&
    checkObj.accessList.find(
      (el) => el.userId === userId && el.accessType === 'edit',
    )
  ) {
    return true;
  }

  if (
    permissionsToCheck.includes('view') &&
    checkObj.accessList.find(
      (el) =>
        el.userId === userId &&
        (el.accessType === 'edit' || el.accessType === 'view'),
    )
  ) {
    return true;
  }

  return false;
}
