import React from 'react';
import { Button } from '../../components/common/Button';

export const ChatIAView = ({ messages, inputQuery, onInputChange, onSend, isLoading }) => {
  return (
    <div className="flex flex-col h-[70vh] bg-invion-grayLight max-w-3xl mx-auto border-x border-gray-200 rounded-2xl overflow-hidden">
      {/* Header del Chat */}
      <div className="bg-invion-dark text-white p-4 flex items-center gap-3 shadow-md">
        <div className="w-8 h-8 rounded-full bg-invion-turquoise flex items-center justify-center font-bold text-sm">
          🤖
        </div>
        <div>
          <h3 className="text-sm font-bold">Asistente INVION (Kardex IA)</h3>
          <p className="text-[10px] text-invion-mint">Conectado a Google Sheets & Gemini</p>
        </div>
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-invion-turquoise text-white rounded-br-none'
                  : 'bg-white text-invion-dark border border-gray-200 shadow-sm rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-500 border border-gray-200 p-3.5 rounded-2xl rounded-bl-none text-xs animate-pulse">
              🔍 Analizando Kardex Consolidado...
            </div>
          </div>
        )}
      </div>

      {/* Input de Pregunta */}
      <form onSubmit={onSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={onInputChange}
          placeholder="Ej: ¿Qué productos tienen faltantes o mercancía dañada?"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-invion-grayLight text-xs text-invion-dark rounded-xl focus:outline-none border border-transparent focus:border-invion-turquoise disabled:opacity-50"
        />
        <Button type="submit" variant="primary" className="!w-auto !px-4" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
};