import React from 'react';
import { Button } from '../../components/common/Button';

export const ChatIAView = ({ messages, inputQuery, onInputChange, onSend }) => {
  return (
    <div className="flex flex-col h-screen bg-invion-grayLight max-w-2xl mx-auto border-x border-gray-200">
      {/* Header del Chat */}
      <div className="bg-invion-dark text-white p-4 flex items-center gap-3 shadow-md">
        <div className="w-8 h-8 rounded-full bg-invion-turquoise flex items-center justify-center font-bold text-sm">
          🤖
        </div>
        <div>
          <h3 className="text-sm font-bold">Asistente INVION</h3>
          <p className="text-[10px] text-invion-mint">IA conectada a la Base de Datos</p>
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
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-invion-turquoise text-white rounded-br-none'
                  : 'bg-white text-invion-dark border border-gray-200 shadow-sm rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input de Pregunta */}
      <form onSubmit={onSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={onInputChange}
          placeholder="Escribe tu pregunta sobre el inventario..."
          className="flex-1 px-4 py-2.5 bg-invion-grayLight text-xs text-invion-dark rounded-xl focus:outline-none border border-transparent focus:border-invion-turquoise"
        />
        <Button type="submit" variant="primary" className="!w-auto !px-4">
          Enviar
        </Button>
      </form>
    </div>
  );
};