function isValidFolderOrFileName(folderName: string): boolean {
  const invalidChars = /\//; // (slash)
  const maxLength = 255; // Maximum length for file names on most file systems

  if (invalidChars.test(folderName)) return false;
  if (folderName.length > maxLength) return false;

  return true;
}

export { isValidFolderOrFileName };
