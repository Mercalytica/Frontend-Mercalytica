import React from "react";
import { Loader2 } from "lucide-react";
import type { ChatMessage } from "../types/types";
import ChatMessages from "./ChatMessage";

interface Props {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const ChatWindow: React.FC<Props> = ({ messages, isLoading }) => {
  return (
 <div
  className="flex-1 backdrop-blur-lg   p-6 mb-6 overflow-y-auto custom-scrollbar"
 
>
      <div className="space-y-2">
        {messages.map((msg) => (
          <ChatMessages key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className=" border-2 border-pink-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg">
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" 
                style={{color: "#C47698"}}/>
                <span className="text-sm"
                style={{color: "#C47698"}}>Analizando...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;

