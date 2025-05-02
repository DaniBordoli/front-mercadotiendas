import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

export interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  sender, 
  timestamp = new Date() 
}) => {
  return (
    <div 
      className={`flex mb-4 ${
        sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          sender === 'user' 
            ? 'bg-[#FF4F41] text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="flex items-center mb-1">
          {sender === 'ai' ? (
            <FaRobot className="mr-2 text-[#FF4F41]" />
          ) : (
            <FaUser className="mr-2 text-[#FF4F41]" />
          )}
          <span className="font-bold">
            {sender === 'ai' ? 'Asistente AI' : 'Tú'}
          </span>
          <span className="text-xs ml-2 opacity-70">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}; 