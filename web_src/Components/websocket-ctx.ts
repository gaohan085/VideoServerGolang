import { createContext } from "react";
import type { VideoStatus } from "./websocket";

const WsContext = createContext<{
  convertingElems?: VideoStatus[];
}>({ convertingElems: undefined });

export default WsContext;