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
  accesList?: Access[];
};

export type deleteFolderType = {
  id: number;
};
