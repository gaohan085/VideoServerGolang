/// <reference types="webpack/module" />
/// <reference types="sass" />

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

type CSSModuleClasses = Readonly<Record<string, string>>;


// declare module "*.module.scss"{
//   const classes: Record<string, string>;
//   export default classes;
// }

declare module "*.css";
declare module "*.module.scss";
declare module "*.sass";
declare module "*.less";
declare module "*.styl";
declare module "*.stylus";
declare module "*.pcss";
declare module "*.sss";

// Built-in asset types
// see `src/node/constants.ts`

// images
declare module "*.apng" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.jfif" {
  const src: string;
  export default src;
}
declare module "*.pjpeg" {
  const src: string;
  export default src;
}
declare module "*.pjp" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.ico" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.avif" {
  const src: string;
  export default src;
}

// media
declare module "*.mp4" {
  const src: string;
  export default src;
}
declare module "*.webm" {
  const src: string;
  export default src;
}
declare module "*.ogg" {
  const src: string;
  export default src;
}
declare module "*.mp3" {
  const src: string;
  export default src;
}
declare module "*.wav" {
  const src: string;
  export default src;
}
declare module "*.flac" {
  const src: string;
  export default src;
}
declare module "*.aac" {
  const src: string;
  export default src;
}
declare module "*.opus" {
  const src: string;
  export default src;
}
declare module "*.mov" {
  const src: string;
  export default src;
}

// fonts
declare module "*.woff" {
  const src: string;
  export default src;
}
declare module "*.woff2" {
  const src: string;
  export default src;
}
declare module "*.eot" {
  const src: string;
  export default src;
}
declare module "*.ttf" {
  const src: string;
  export default src;
}
declare module "*.otf" {
  const src: string;
  export default src;
}

// other
declare module "*.webmanifest" {
  const src: string;
  export default src;
}
declare module "*.pdf" {
  const src: string;
  export default src;
}
declare module "*.txt" {
  const src: string;
  export default src;
}

// wasm?init
declare module "*.wasm?init" {
  const initWasm: (
    options?: WebAssembly.Imports,
  ) => Promise<WebAssembly.Instance>;
  export default initWasm;
}
