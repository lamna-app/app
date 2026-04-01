import { Socket } from "@/libs/socket"

const socket = new Socket()
export const useSocket = () => socket
