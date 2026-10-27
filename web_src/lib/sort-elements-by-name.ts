import type { RespElement } from "../Components/types.d.ts";

const sortElements = (a: RespElement, b: RespElement) => {
  if (a.type === "file" && b.type ==="directory") return 1;
  if (a.type ==="directory" && b.type === "file") return -1;
  if (a.type ==="directory" && b.type ==="directory")
    return a.name.localeCompare(b.name, ["ja", "en"]);
  if (a.type === "file" && b.type === "file") return a.name.localeCompare(b.name, ["ja", "en"]);
  return 0;
};

export default sortElements;
