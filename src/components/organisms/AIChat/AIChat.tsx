import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import { ChatMessage } from '../../molecules/ChatMessage/ChatMessage';
import { ChatButton } from '../../molecules/ChatButton/ChatButton';
import { sendChatMessageToAI } from '../../../services/api';

// Chat message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Props for the component
interface AIChatProps {
  onApplyTemplateChanges: (changes: any) => void;
  initialVariables: any;
  onChatComplete: () => void;
}

// Common questions asked by the AI to guide the user
const TEMPLATE_QUESTIONS = [
  "¡Hola! Soy tu asistente para crear tu tienda. Te haré preguntas para configurarla según tus necesidades. ¿Cómo se llamará tu tienda?",
  "¿En qué industria/rubro estás o qué tipo de productos venderás?",
  "¿Puedes contarme un poco sobre tu marca? ¿Tiene una historia o misión que te gustaría transmitir?",
  "¿Tenés un lema o frase que defina tu marca/propuesta?",
  "¿Qué valores son importantes para vos y te gustaría reflejar en la tienda?",
  "¿Tenés preferencias de color o estilo?",
];

// Primary and hover colors from theme
const primaryColor = '#FF4F41';
const hoverColor = '#E04437'; // Slightly darker version for hover

export const AIChat: React.FC<AIChatProps> = ({ onApplyTemplateChanges, initialVariables, onChatComplete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-question-0',
      text: TEMPLATE_QUESTIONS[0],
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === '' || isAIThinking) return; // Prevent sending while AI is thinking

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    const currentInput = input; // Capture input before clearing
    setInput('');
    setIsAIThinking(true); // Start loading indicator

    try {
      // Send the updated message history and current template state
      const aiResponse: { reply: string; templateUpdates: any | null; isFinalStep?: boolean } = await sendChatMessageToAI(updatedMessages, initialVariables);

      // Add AI's conversational reply
      const newAiMessage: Message = {
        id: Date.now().toString() + '-ai-reply', // Distinct ID for reply
        text: aiResponse.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      // Use a temporary variable to build the messages for the next state update
      let messagesToAddAfterReply: Message[] = [newAiMessage];

      // Apply template updates if received
      if (aiResponse.templateUpdates && typeof aiResponse.templateUpdates === 'object') {
        console.log('[AIChat] Received templateUpdates:', JSON.stringify(aiResponse.templateUpdates, null, 2));
        onApplyTemplateChanges(aiResponse.templateUpdates);
      }

      // Check if the chat is complete BEFORE deciding to ask next question
      if (aiResponse.isFinalStep) {
        console.log('[AIChat] Chat sequence complete. Triggering onChatComplete.');
        onChatComplete(); // Call the new prop function
        // Potentially add a concluding message if not already handled by the AI's final reply
        // Example: Add a final message only if the AI didn't already say something conclusive
        if (!aiResponse.reply.includes('Hemos configurado')) { // Example condition
          const concludingMessage: Message = {
            id: Date.now().toString() + '-ai-final',
            text: '¡Genial! Hemos configurado los aspectos básicos. Revisa el resumen para confirmar.',
            sender: 'ai',
            timestamp: new Date(),
          };
          messagesToAddAfterReply.push(concludingMessage);
        }
      } else {
        // Only ask the next question if the chat is NOT complete
        const nextQuestionIndex = currentQuestionIndex + 1;
        const aiReplyHasQuestion = aiResponse.reply.includes('?') || aiResponse.reply.includes('¿');
        if (nextQuestionIndex < TEMPLATE_QUESTIONS.length && !aiReplyHasQuestion) {
          const nextQuestionMessage: Message = {
            id: Date.now().toString() + '-ai-q' + nextQuestionIndex,
            text: TEMPLATE_QUESTIONS[nextQuestionIndex],
            sender: 'ai',
            timestamp: new Date(),
          };
          messagesToAddAfterReply.push(nextQuestionMessage);
          setCurrentQuestionIndex(nextQuestionIndex);
        } else if (nextQuestionIndex < TEMPLATE_QUESTIONS.length) {
          setCurrentQuestionIndex(nextQuestionIndex);
        }
      }

      // Checklist item 11: Update messages state with AI reply AND the next question/conclusion
      setMessages(prevMessages => [...prevMessages, ...messagesToAddAfterReply]);

    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Lo siento, ocurrió un error al procesar tu solicitud.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsAIThinking(false); // Stop loading indicator
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <ChatButton isOpen={isOpen} onClick={toggleChat} />
      
      {/* Chat window */}
      <div 
        className={`fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl z-50 flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Chat header */}
        <div className="bg-[#FF4F41] rounded-t-lg p-4 text-white">
          <div className="flex items-center">
            <FaRobot className="mr-2" />
            <h3 className="font-bold">Asistente de Creación de Tienda</h3>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.text}
              sender={msg.sender}
              timestamp={msg.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <div className="p-4 border-t">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4F41] ${isAIThinking ? 'opacity-50 bg-gray-100' : ''}`}
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAIThinking} // Disable input while thinking
            />
            <button
              className={`bg-[#FF4F41] text-white px-4 py-2 rounded-r-lg hover:bg-[#E04437] ${isAIThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSendMessage}
              disabled={isAIThinking} // Disable button while thinking
            >
              {isAIThinking ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};