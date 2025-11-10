import React from "react";
import { Download, FileText } from "lucide-react";
import type { ChatMessage } from "../types/types";

interface Props {
  message: ChatMessage;
}

const ChatMessages: React.FC<Props> = ({ message }) => {
  return (
    <div className={`flex mb-4 animate-fadeIn ${
      message.sender === "user" ? "justify-end" : "justify-start"
    }`}>
      <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3 rounded-2xl  transition-all ${
        message.sender === "user"
          ? "bg-[#C47698] text-white rounded-br-sm"
          : " bg-transparent text-white "
      }`}>
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </div>
        
       {message.pdfUrl && (
  <div className="mt-3 pt-3 border-t border-pink-200">
    <a
      href={message.pdfUrl}
      download={message.pdfName || "reporte.pdf"}
      target="_blank" // Para abrir en nueva pestaña
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <FileText className="w-4 h-4" />
      <span>Descargar Reporte PDF</span>
      <Download className="w-4 h-4" />
    </a>
    <p className="text-xs text-gray-400 mt-1">
      El reporte se abrirá en una nueva ventana
    </p>
  </div>
)}
      </div>
    </div>
  );
};

export default ChatMessages;