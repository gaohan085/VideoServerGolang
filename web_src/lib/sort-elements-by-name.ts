import type { DirElement } from "../Components/types.d.ts";

const sortElements = (a: DirElement, b: DirElement) => {
  if (a.isFile && b.isFolder) return 1;
  if (a.isFolder && b.isFile) return -1;
  if (a.isFolder && b.isFolder)
    return a.name.localeCompare(b.name, ["ja", "en"]);
  if (a.isFile && b.isFile) return a.name.localeCompare(b.name, ["ja", "en"]);
  return 0;
};

export default sortElements;
