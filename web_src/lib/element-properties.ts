import type { RespElement } from "../Components/types.d.ts";
import extname from "./get-file-extname.ts";
import isVideo from "./is-video.ts";
import SN from "./sn.ts";


export class FsElementProptertiesClass implements RespElement {
  declare name: string;
  declare type: "file" | "directory";
  declare mtime: string;
  declare size: number;
  declare private _parentCwd: string;
  declare private _cwd: string;

  constructor(e: RespElement, cwd: string) {
    Object.assign(this, e);
    this._cwd = cwd;
  }

  get isFile(): boolean {
    return this.type === "file";
  }
  get isFolder(): boolean {
    return this.type === "directory";
  }
  get extName(): string {
    return extname(this.name);
  }
  get isVideo(): boolean {
    return isVideo(this.extName);
  }
  get sn(): string {
    return this.isVideo ? SN(this.name) : "";
  }
  get cwd(): string {
    return this._cwd;
  }
  get playSrc(): string {
    return this.isVideo ? "/video"+ this.cwd + this.name:"";
  }
}
