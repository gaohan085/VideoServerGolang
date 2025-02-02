/// <reference types="vite/client" />

type OrientationLockType =
  | "any"
  | "landscape"
  | "landscape-primary"
  | "landscape-secondary"
  | "natural"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary";


declare interface ScreenOrientation extends EventTarget {
  lock(orientation: OrientationLockType): Promise<void>;
}

type CSSModuleClasses = Readonly<Record<string, stringq>>;

declare module "*.module.scss" {
  const Classes : CSSModuleClasses;
  export default Classes;
}