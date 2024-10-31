import { User } from 'src/modules/users/user.graphql.entity';

export type ExternalDataType = {
  accessToken: string;
  refreshToken?: string;
  email: string;
};

export type AccessRefreshTokenType = {
  accessToken: string;
  refreshToken?: string;
};

export type JwtPayloadType = {
  id: number;

  ist?: number;
  exp?: number;
};

export type PermissionsToCheckType = {
  user: User;
  checkObj: any;
};
