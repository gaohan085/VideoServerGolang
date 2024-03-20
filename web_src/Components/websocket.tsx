import React, { PropsWithChildren, createContext, useEffect, useState } from "react"

export interface VideoStatus {
  fileName: string
  path: string
  status: "pending" | "converting" | "done",
  duration: number
  progress: number
  playSource: string
}

export const WsContext = createContext<{
  convertingElems?: VideoStatus[]
}>({ convertingElems: undefined })

export const WebSocketLayer: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const [convertState, setConvertState] = useState<string | undefined>(undefined)

  useEffect(() => {
    const hostname = window.location.hostname
    const ws = new WebSocket("ws://" + hostname + "/api/ws")
    const intervalID = setInterval(() => { ws.send("Hello from server") }, 1500)
    ws.onmessage = (data: MessageEvent<string>) => setConvertState(data.data)

    return () => {
      clearInterval(intervalID)
      ws.onopen = () => ws.close()
    }
  }, [setConvertState])

  useEffect(() => {
    console.log(convertState)
  }, [convertState])

  return (
    <WsContext.Provider value={{ convertingElems: convertState ? JSON.parse(convertState) as VideoStatus[] : undefined }}>
      {children}
    </WsContext.Provider>
  )
}