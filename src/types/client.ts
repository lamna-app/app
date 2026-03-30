export type ClientResponse<T> = {
  data: T
  status: number
}

export type LoginResponse = {
  email: string
  id: string
  username: string
}

export type MeResponse = {
  id: string
  email: string
  username: string
}
