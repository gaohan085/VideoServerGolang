import { type DirElement } from "../Components";

export const sortElements = (a: DirElement, b: DirElement) => {
  if (a.isFile && b.isFolder) return 1;
  if (a.isFolder && b.isFile) return -1;
  if (a.isFolder && b.isFolder)
    return a.name.localeCompare(b.name, ["ja", "en"]);
  if (a.isFile && b.isFile) return a.name.localeCompare(b.name, ["ja", "en"]);
  return 0;
};
