import { ViewEnum } from 'src/enums/view.enum';

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
};

export type deleteFileType = {
  id: number;
};
