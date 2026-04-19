type EventHandler<T> = (data: T) => void

export class Socket {
  private static BASE = import.meta.env.VITE_WS_URL
  private static VERSION = 1

  private ws?: WebSocket
  private _handlers: Map<string, EventHandler<unknown>[]> = new Map()

  private _heartbeatInterval: Option<number> = null
  private _heartbeat = 30 // seconds

  private _token?: string

  private _reconnectTimeout: Option<number> = null
  private _shouldReconnect = false
  private _reconnectDelay = 3

  connect(token: string) {
    this._token = token
    this._shouldReconnect = true
    this._handlers = new Map()
    this._open()
  }

  private _open() {
    this.ws = new WebSocket(`${Socket.BASE}/v${Socket.VERSION}/ws?token=${this._token}`)

    this.ws.onopen = () => {
      console.log("[websocket] connected")

      this._heartbeatInterval = setInterval(() => {
        if (this.isOpen()) {
          this.ws?.send(JSON.stringify({ op: 3, e: "ping" }))
        }
      }, this._heartbeat * 1000)
    }

    this.ws.onclose = () => {
      console.log("[websocket] disconnected")
      if (this._heartbeatInterval) clearInterval(this._heartbeatInterval)

      if (this._shouldReconnect) {
        console.log(`[websocket] reconnecting in ${this._reconnectDelay}s...`)

        this._reconnectTimeout = setTimeout(() => {
          this._open()
        }, this._reconnectDelay * 1000)
      }
    }

    this.ws.onerror = err => console.error("[websocket] error:", err)

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
    this._shouldReconnect = false
    if (this._reconnectTimeout) clearTimeout(this._reconnectTimeout)

    this._token = undefined
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
