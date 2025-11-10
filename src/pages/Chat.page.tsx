import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/SideBar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";
import type { ChatMessage, ChatSession } from "../types/types";
import { v4 as uuidv4 } from "uuid";

const ChatPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ USAR localhost:5000 (0.0.0.0 es para el servidor, localhost para el cliente)
  const BACKEND_URL = "http://localhost:5001";
  const USER_ID = "U-123";

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages);
      setShowWelcome(false);
    }
  }, [currentSessionId]);

  const loadUserSessions = async () => {
    try {
      setConnectionError(false);
      console.log("🔄 Cargando sesiones...");
      
      const response = await fetch(`${BACKEND_URL}/api/chatBot/myHistory/${USER_ID}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const sessionsData = await response.json();
      console.log("✅ Sesiones cargadas:", sessionsData);
      
      // Adaptar respuesta del backend
      const adaptedSessions: ChatSession[] = sessionsData.map((session: any) => ({
        id: session.id_session || session.id || uuidv4(),
        title: session.title || "Conversación",
        preview: session.last_message || session.preview || "",
        timestamp: new Date(session.timestamp || Date.now()),
        messages: session.messages || []
      }));
      
      setSessions(adaptedSessions);
    } catch (error) {
      console.error("❌ Error cargando sesiones:", error);
      setConnectionError(true);
      setSessions([]);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      setConnectionError(false);
      console.log("🔄 Cargando mensajes de sesión:", sessionId);
      
      const response = await fetch(`${BACKEND_URL}/api/chatBot/history/${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const sessionData = await response.json();
      console.log("✅ Mensajes cargados:", sessionData);
      
      const messagesArray = sessionData.messages || sessionData || [];
      
      const adaptedMessages: ChatMessage[] = messagesArray.map((msg: any) => ({
        id: uuidv4(),
        text: msg.message || msg.text || "",
        sender: msg.type === "user" ? "user" : "bot",
        timestamp: new Date(msg.timestamp || Date.now())
      }));
      
      return adaptedMessages;
    } catch (error) {
      console.error("❌ Error cargando mensajes:", error);
      setConnectionError(true);
      return [];
    }
  };

  useEffect(() => {
    loadUserSessions();
  }, []);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setShowWelcome(true);
  };

  const handleSelectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const sessionMessages = await loadSessionMessages(sessionId);
    setMessages(sessionMessages);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title: newTitle } : s
    ));
  };

  const updateOrCreateSession = (newMessages: ChatMessage[]) => {
    const firstUserMessage = newMessages.find(m => m.sender === "user");
    const title = firstUserMessage?.text.slice(0, 50) || "Nueva conversación";
    const preview = newMessages[newMessages.length - 1]?.text.slice(0, 60) || "";

    if (currentSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: newMessages, preview, timestamp: new Date() }
          : s
      ));
    } else {
      const newSession: ChatSession = {
        id: uuidv4(),
        title,
        preview,
        timestamp: new Date(),
        messages: newMessages
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    }
  };

  const handleSend = async (text: string) => {
    if (showWelcome) {
      setShowWelcome(false);
    }

    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender: "user",
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setConnectionError(false);

    try {
      const sessionId = currentSessionId || uuidv4();
      
      console.log("📤 Enviando mensaje:", {
        id_session: sessionId,
        user_id: USER_ID,
        message: text
      });

      // ✅ Estructura EXACTA que espera tu backend
      const response = await fetch(`${BACKEND_URL}/api/chatBot`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_session: sessionId,
          user_id: USER_ID,
          messages: [
            { 
              types: "user",  // ✅ "type" no "types"
              message: text,
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Respuesta del backend:", data);

      let botResponse = "Lo siento, no se pudo procesar tu mensaje.";
      let pdfUrl = null;
      let pdfName = null;

      // Manejar respuesta
      if (typeof data === 'string') {
        botResponse = data;
      } else if (data.message) {
        botResponse = data.message;
      } else if (data.reply) {
        botResponse = data.reply;
      }

      // ✅ Detectar PDF en la respuesta
      if (botResponse && botResponse.includes("/api/reports/download/")) {
        const pdfMatch = botResponse.match(/\/api\/reports\/download\/[^\s]+/);
        if (pdfMatch) {
          const pdfPath = pdfMatch[0];
          pdfUrl = `${BACKEND_URL}${pdfPath}`;
          pdfName = `reporte_${Date.now()}.pdf`;
          
          // Limpiar el texto
          botResponse = botResponse.replace(pdfPath, '').trim();
          if (!botResponse) {
            botResponse = "📊 He generado un reporte PDF para ti. ¡Puedes descargarlo abajo!";
          }
        }
      }

      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: botResponse,
        sender: "bot",
        ...(pdfUrl && { 
          pdfUrl: pdfUrl, 
          pdfName: pdfName 
        })
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      updateOrCreateSession(finalMessages);

    } catch (err) {
      console.error("❌ Error:", err);
      setConnectionError(true);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: "🔌 Error de conexión\n\nVerifica que el backend esté corriendo en localhost:5000",
        sender: "bot",
        isError: true
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      updateOrCreateSession(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const retryConnection = () => {
    setConnectionError(false);
    loadUserSessions();
  };

  // 🔧 Si localhost no funciona, prueba con 127.0.0.1
  const testBackendConnection = async () => {
    try {
      const testResponse = await fetch("http://localhost:5000/api/chatBot/myHistory/U-123");
      if (testResponse.ok) {
        console.log("✅ Conexión exitosa con localhost:5000");
        return true;
      }
    } catch (error) {
      console.log("❌ localhost:5000 falló, probando 127.0.0.1:5000...");
      try {
        const testResponse2 = await fetch("http://127.0.0.1:5000/api/chatBot/myHistory/U-123");
        if (testResponse2.ok) {
          console.log("✅ Conexión exitosa con 127.0.0.1:5000");
          return true;
        }
      } catch (error2) {
        console.error("❌ Ambas conexiones fallaron");
        return false;
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {connectionError && (
          <div className="bg-red-500 text-white p-3 text-center">
            <p>⚠️ No se puede conectar al servidor</p>
            <div className="flex gap-2 justify-center mt-2">
              <button 
                onClick={retryConnection}
                className="bg-white text-red-500 px-3 py-1 rounded text-sm"
              >
                Reintentar
              </button>
              <button 
                onClick={testBackendConnection}
                className="bg-white text-red-500 px-3 py-1 rounded text-sm"
              >
                Probar conexión
              </button>
            </div>
          </div>
        )}
        
        {showWelcome && messages.length === 0 ? (
          <WelcomeScreen 
            onSend={handleSend}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent"
                   style={{color: "#C47698"}}>
                    Mercodex
                  </h1>
                </div>
              </div>
              
              <ChatWindow messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
              <ChatInput onSend={handleSend} disabled={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;



