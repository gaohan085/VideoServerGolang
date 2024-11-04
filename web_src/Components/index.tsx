import { lazy } from "react";

export const ErrorElement = lazy(() => import("./error-element"));
export const InteractiveFileElement = lazy(() => import("./file-element"));
export const InteractiveFileSysSideBar = lazy(() => import("./file-system-sidebar"));
export const InteractiveFolderElement = lazy(() => import("./folder-element"));
export const InteractiveOpenFolderContainer = lazy(() => import("./open-folder-container-element"));
export const InteractiveRenameComponent = lazy(() => import("./rename-element"));
export const InteractiveCtxMenu = lazy(() => import("./right-click-context-menu"));
export const StatusBar = lazy(() => import("./status-bar"));
export const VideoBoxes = lazy(() => import("./video-boxes-sidebar"));
export const WebSocketLayer = lazy(() => import("./websocket"));
export const Title = lazy(() => import("./player-title"));
export const Player = lazy(() => import("./player"));

export * from "./file-system-sidebar";
export * from "./types.d";
export * from "./websocket";
export * from "./status-bar";
export * from "./spinner";