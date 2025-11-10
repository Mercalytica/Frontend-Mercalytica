export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  pdfUrl?: string;
  pdfName?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: ChatMessage[];
}