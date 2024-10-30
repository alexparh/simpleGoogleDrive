import { AccessEnum } from 'src/enums/access.enum';
import { Access } from './access.type';

export type createFolderType = {
  name: string;
  parentFolderId: number;
};

export type cloneFolderType = {
  id: number;
  parentFolderId: number;
};

export type updateFolderType = {
  id: number;
  name: string;
  accessList?: Access[];
};

export type deleteFolderType = {
  id: number;
};

export type setFolderAccesss = {
  folderId: number;
  userId: number;
  accessType: AccessEnum;
  parentAccessFolderId?: number;
  isRoot?: boolean;
};
