import { ViewEnum } from 'src/enums/view.enum';
import { Access } from './access.type';

export type loadFileType = {
  id: number;
};
export type uploadFileType = {
  folderId: number;
};

export type cloneFileType = {
  id: number;
  folderId: number;
};

export type updateFileType = {
  id: number;
  name?: string;
  viewType?: ViewEnum;
  accessList?: Access[];
};

export type deleteFileType = {
  id: number;
};
