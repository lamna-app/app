type EventHandler<T> = (data: T) => void

export class Socket {
  private static BASE = import.meta.env.VITE_WS_URL
  private static VERSION = 1

  private ws?: WebSocket
  private _handlers: Map<string, EventHandler<unknown>[]> = new Map()

  private _heartbeatInterval: Option<number> = null
  private _heartbeat = 30 // seconds

  connect(token: string) {
    this._handlers = new Map() // Clear stale state
    this.ws = new WebSocket(`${Socket.BASE}/v${Socket.VERSION}/ws?token=${token}`)

    this.ws.onopen = () => {
      console.log("Websocket connected")

      this._heartbeatInterval = setInterval(() => {
        if (this.isOpen()) {
          this.ws?.send(JSON.stringify({ op: 3, e: "ping" }))
        }
      }, this._heartbeat * 1000)
    }

    this.ws.onclose = () => {
      console.log("Websocket disconnected")

      if (this._heartbeatInterval) {
        clearInterval(this._heartbeatInterval)
      }
    }

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
    return this.ws && this.ws.readyState === this.ws.OPEN
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
