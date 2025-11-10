import React from "react";
import {  Search, FileText, BarChart3, Zap } from "lucide-react";
import ChatInput from "./ChatInput";

interface Props {
  onSend: (text: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<Props> = ({ onSend, onSuggestionClick }) => {
  const suggestions = [
    {
      icon: Search,
      text: "Analiza el iPhone 15 Pro Max",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: BarChart3,
      text: "Compara Samsung Galaxy S24 vs iPhone",
      color: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: FileText,
      text: "Genera reporte de Tesla Model 3",
      color: "from-purple-500 to-fuchsia-500"
    },
    {
      icon: Zap,
      text: "Opiniones sobre PlayStation 5",
      color: "from-pink-600 to-rose-600"
    }
  ];

  return (
    <div className=" flex flex-col items-center justify-center  p-3 md:p-3">
      <div className="max-w-5xl w-full items-center justify-center ">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-6xl md:text-7xl mt-5 font-bold  bg-clip-text text-transparent"
             style={{color: "#C47698"}}>
              Mercodex
            </h1>
           
          </div>
         
          <p className="text-white text-sm md:text-base max-w-3xl mx-auto">
            Analiza productos, genera reportes profesionales y obtén insights del mercado con inteligencia artificial
          </p>
        </div>

        {/* Capacidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-pink-200/50 hover:border-pink-300 transition-all hover:shadow-lg hover:-translate-y-1">
            
            <h3 className="font-bold text-gray-950 mb-2">Búsqueda Web</h3>
            <p className="text-sm text-gray-800">Análisis en tiempo real de productos y opiniones en redes sociales</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-pink-200/50 hover:border-pink-300 transition-all hover:shadow-lg hover:-translate-y-1">
            
            <h3 className="font-bold text-gray-950 mb-2">Análisis de Sentimiento</h3>
            <p className="text-sm text-gray-800">Evaluación de opiniones positivas y negativas del mercado</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-pink-200/50 hover:border-pink-300 transition-all hover:shadow-lg hover:-translate-y-1">
           
            <h3 className="font-bold text-gray-950 mb-2">Reportes PDF</h3>
            <p className="text-sm text-gray-800">Genera documentos profesionales con análisis completo</p>
          </div>
        </div>

     
        <div className="mb-8">
          <p className="text-center text-sm font-medium mb-4"
           style={{color: "#C47698"}}> Prueba con estas consultas:</p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-3xl mx-auto items-center">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="group bg-white/90 backdrop-blur-sm rounded-3xl p-2 border-2 border-pink-200/50 w-90 hover:border-pink-300 transition-all hover:shadow-lg hover:-translate-y-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${suggestion.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {suggestion.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

       
        <div className="max-w-3xl mx-auto"
        style={{color: "#000000"}}>
          <ChatInput onSend={onSend} disabled={false} placeholder="¿Qué producto quieres analizar?"
           />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;