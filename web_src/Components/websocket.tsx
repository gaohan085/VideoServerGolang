import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import type {
  PropsWithChildren
} from "react";

export interface VideoStatus {
  fileName: string;
  path: string;
  status: "pending" | "converting" | "done";
  duration: number;
  progress: number;
  playSource: string;
}

export const WsContext = createContext<{
  convertingElems?: VideoStatus[];
}>({ convertingElems: undefined });

const WebSocketLayer: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [convertState, setConvertState] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const hostname = window.location.hostname;
    const protrol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const ws = new WebSocket(protrol + hostname + "/api/ws");
    const intervalID = setInterval(() => {
      ws.send("Hello from server");
    }, 3000);
    ws.onmessage = (data: MessageEvent<string>) => setConvertState(data.data);

    return () => {
      clearInterval(intervalID);
      ws.onopen = () => ws.close();
    };
  }, [setConvertState]);

  return (
    <WsContext.Provider
      value={{
        convertingElems: convertState
          ? (JSON.parse(convertState) as VideoStatus[])
          : undefined,
      }}
    >
      {children}
    </WsContext.Provider>
  );
};

export default WebSocketLayer;