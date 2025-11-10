import React, { useState } from "react";


interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<Props> = ({ 
  onSend, 
  disabled, 
  placeholder = "Escribe tu mensaje aquí... " 
}) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3  backdrop-blur-lg rounded-3xl shadow-sm shadow-pink-200/40 border-2 border-pink-200/40 p-3">
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        className="flex-1 px-5 py-3  rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-fuchsia-400 transition-all placeholder:text-pink-300 text-gray-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
         style={{ border: "2px solid #9c5e79", color:"#000000" }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        type="button"
        className="px-6 py-3 
          text-white rounded-2xl cursor-pointer font-semibold  "
 style={{background: "#C47698"}}>
        <span className="hidden sm:inline">Enviar</span>
        
      </button>
    </div>
  );
};

export default ChatInput;