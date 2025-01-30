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