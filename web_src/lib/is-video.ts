export const isVideo = (extName: string): boolean => {
  const formatList = [
    ".wmv",
    ".asf",
    ".asx",
    ".rm",
    ".rmvb",
    ".mp4",
    ".3gp",
    ".mov",
    ".m4v",
    ".avi",
    ".dat",
    ".mkv",
    ".flv",
    ".vob",
    ".mpg",
    ".mpeg",
    ".ts",
  ];

  return formatList.includes(extName);
};
