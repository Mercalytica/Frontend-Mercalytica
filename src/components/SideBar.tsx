import React, { useState } from "react";
import { 
  PanelLeftClose, 
  PanelLeft, 
  Plus, 
  MessageSquare, 
  Trash2, 
  MoreVertical,
  Edit2,
  Clock
} from "lucide-react";
import type { ChatSession } from "../types/types";

interface Props {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<Props> = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  isOpen,
  setIsOpen
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return "Últimos 7 días";
    if (days < 30) return "Últimos 30 días";
    return "Más antiguo";
  };

  const groupedSessions = sessions.reduce((acc, session) => {
    const group = formatDate(session.timestamp);
    if (!acc[group]) acc[group] = [];
    acc[group].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  const handleStartEdit = (session: ChatSession) => {
    setEditingId(session.id);
    setEditTitle(session.title);
    setOpenMenuId(null);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editTitle.trim() && onRenameSession) {
      onRenameSession(sessionId, editTitle.trim());
    }
    setEditingId(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-black backdrop-blur-lg rounded-2xl shadow-lg border-2 border-pink-200/50 hover:border-pink-300 transition-all hover:shadow-xl"
      >
        <PanelLeft className="w-5 h-5" 
         style={{color: "#C47698"}} />
      </button>
    );
  }

  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-black backdrop-blur-lg border-r-2 border-pink-200/30 shadow-2xl z-40 flex flex-col">
      <div className="p-4 border-b-2 border-pink-200/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{background: "#C47698"}}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Mercodex</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-pink-100 rounded-lg transition-colors"
          >
            <PanelLeftClose className="w-5 h-5"
            style={{color :"#C47698"}} />
          </button>
        </div>
        
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
           style={{background: "#C47698"}}>
          <Plus className="w-5 h-5" />
          <span className="text-sm">Nuevo Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {Object.keys(groupedSessions).length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-3"
             style={{color: "#C47698"}} />
            <p className="text-sm text-gray-500">No hay chats aún</p>
            <p className="text-xs text-gray-400 mt-1">Comienza una conversación</p>
          </div>
        ) : (
          Object.entries(groupedSessions).map(([group, groupSessions]) => (
            <div key={group} className="mb-4">
              <h3 className="text-xs font-semibold mb-2 px-2 flex items-center gap-2"
               style={{color: "#C47698"}}>
                <Clock className="w-3 h-3" />
                {group}
              </h3>
              <div className="space-y-1">
                {groupSessions.map((session) => (
                  <div
                    key={session.id}
                    className="relative group"
                    onMouseLeave={() => setOpenMenuId(null)}
                  >
                    {editingId === session.id ? (
                      <div className="px-3 py-2 bg-white rounded-xl border-2 border-pink-300">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(session.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          onBlur={() => handleSaveEdit(session.id)}
                          autoFocus
                          className="w-full text-sm outline-none"
                        />
                      </div>
                    ) : (
                     <div
  role="button"
  onClick={() => onSelectSession(session.id)}
  className={`cursor-pointer w-full text-left px-3 py-2 rounded-xl transition-all flex items-start justify-between gap-2 ${
    currentSessionId === session.id
      ? "bg-gradient-to-r from-pink-100 to-fuchsia-100 border-2 border-pink-300"
      : "hover:bg-pink-50 border-2 border-transparent"
  }`}
>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <MessageSquare className="w-4 h-4 flex-shrink-0" style={{ color: "#C47698" }} />
      <p className="font-medium text-sm text-gray-800 truncate">{session.title}</p>
    </div>
    <p className="text-xs text-gray-500 truncate pl-6">{session.preview}</p>
  </div>

  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === session.id ? null : session.id);
    }}
    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-pink-200 rounded-lg transition-all flex-shrink-0"
  >
    <MoreVertical className="w-4 h-4 text-gray-600" />
  </button>
</div>

                    )}

                    {openMenuId === session.id && (
                      <div className="absolute right-2 top-12 bg-white rounded-xl shadow-xl border-2 border-pink-200 p-1 z-10 min-w-[140px]">
                        <button
                          onClick={() => handleStartEdit(session)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Renombrar
                        </button>
                        <button
                          onClick={() => {
                            onDeleteSession(session.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 rounded-lg transition-colors"
                       style={{color: "#C47698"}}>
                          <Trash2 className="w-4 h-4"  style={{color: "#C47698"}}></Trash2>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t-2 border-pink-200/30">
        <div className="text-xs text-gray-500 text-center">
          <p className="font-medium"
           style={{color: "#C47698"}}>Mercodex</p>
          <p>Análisis de Competencia</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;