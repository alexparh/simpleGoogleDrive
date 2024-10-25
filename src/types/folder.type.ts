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
};

export type deleteFolderType = {
  id: number;
};
