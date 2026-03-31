type EventHandler<T> = (data: T) => void

export class Socket {
  private ws?: WebSocket

  private _handlers: Map<string, EventHandler<unknown>[]> = new Map()

  private static BASE_URL = "ws://localhost:3000"

  connect(token: string) {
    this.ws = new WebSocket(`${Socket.BASE_URL}/v1/ws?token=${token}`)

    this.ws.onopen = () => console.log("ws connected")
    this.ws.onclose = () => console.log("ws disconnected")
    this.ws.onerror = err => console.error("ws error", err)

    this.ws.onmessage = event => {
      const { e: type, d: data } = JSON.parse(event.data)
      for (const handler of this.handlers(type)) handler(data)
    }
  }

  disconnect() {
    this.ws?.close()
  }

  handlers(event: string) {
    return this._handlers.get(event) ?? []
  }

  on<T>(event: string, handler: EventHandler<T>) {
    this._handlers.set(event, [...this.handlers(event), handler as EventHandler<unknown>])
  }
}
