interface Message {
  id: number;
  author: string;
  content: string;
}

interface MessageCreateEvent {
  message: string
}