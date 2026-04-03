type EventHandler<T> = (data: T) => void

export class Socket {
  private static BASE = import.meta.env.VITE_WS_URL
  private static VERSION = 1

  private ws?: WebSocket
  private _handlers: Map<string, EventHandler<unknown>[]> = new Map()

  connect(token: string) {
    this.ws = new WebSocket(`${Socket.BASE}/v${Socket.VERSION}/ws?token=${token}`)

    this.ws.onopen = () => console.log("Websocket connected")
    this.ws.onclose = () => console.log("Websocket disconnected")
    this.ws.onerror = err => console.error("Websocket error:", err)

    this.ws.onmessage = event => {
      const { e: type, d: data } = JSON.parse(event.data)
      for (const handler of this.handlers(type)) {
        try {
          handler(data)
        } catch {}
      }
    }
  }

  disconnect() {
    this.ws?.close()
  }

  isOpen() {
    if (!this.ws) return false
    return this.ws?.readyState === this.ws?.OPEN
  }

  handlers(event: string) {
    return this._handlers.get(event) ?? []
  }

  on<T>(event: string, handler: EventHandler<T>) {
    this._handlers.set(event, [...this.handlers(event), handler as EventHandler<unknown>])
  }

  off<T>(event: string, handler: EventHandler<T>) {
    this._handlers.set(
      event,
      this.handlers(event).filter(h => h !== handler)
    )
  }
}
