import { AccessEnum } from 'src/enums/access.enum';

export type Access = {
  email: string;
  accessType: AccessEnum;
};

export type ClearAccess = {
  fielId?: number;
  folderId?: number;
};

export type CreateAccess = {
  email: string;
  accessType: AccessEnum;
  folderId?: number;
  fileId?: number;
};

export type AddParentFolderAccess = {
  folderId?: number;
  fileId?: number;
  parentFolderId: number;
};
