import { useEffect, type ReactNode } from "react";
import useBoundStore from "../lib/zustand-store.ts";
import type { VideoCvQueue } from "./types.d.ts";

const WebSocketLayer = ({ children }: { children: ReactNode }) => {
  const { setVideoCVQueue } = useBoundStore((state) => state);

  useEffect(() => {
    const ws = new WebSocket("/api/ws");
    const intervalID = setInterval(() => {
      ws.send("Hello from server");
    }, 3000);
    ws.onmessage = (data: MessageEvent<string>) =>
      setVideoCVQueue(JSON.parse(data.data) as VideoCvQueue);

    return () => {
      clearInterval(intervalID);
      ws.onopen = () => ws.close();
    };
  }, [setVideoCVQueue]);

  return <>{children}</>;
};

export default WebSocketLayer;
