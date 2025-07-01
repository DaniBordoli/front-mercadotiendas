import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaMinus } from 'react-icons/fa';
import { ChatMessage } from '../../molecules/ChatMessage/ChatMessage';
import { ChatButton } from '../../molecules/ChatButton/ChatButton';
import { sendChatMessageToAI } from '../../../services/api';
import { useShopStore } from '../../../stores/slices/shopStore';
import { useAuthStore } from '../../../stores';
import { Modal } from '../../molecules/Modal/Modal';
import { updateShopTemplate } from '../../../services/api';

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
  onChatComplete: (shopData: any) => void; 
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
  const user = useAuthStore(state => state.user);
  const hasShop = user?.shop;
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Mensaje inicial adaptado según si tiene tienda o no
  const getInitialMessage = () => {
    if (hasShop) {
      return "¡Hola! Tu tienda está lista. Puedo ayudarte a personalizar colores, textos y otros aspectos de tu tienda. ¿Qué te gustaría modificar?";
    }
    return TEMPLATE_QUESTIONS[0];
  };

  const [isOpen, setIsOpen] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-question-0',
      text: getInitialMessage(),
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(initialVariables || {});
  const [previousTemplate, setPreviousTemplate] = useState<any>(null);
  const [pendingShopData, setPendingShopData] = useState<any>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pendingTemplateUpdate, setPendingTemplateUpdate] = useState<any>(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateSaveError, setTemplateSaveError] = useState<string | null>(null);
  const [hoveredColorKey, setHoveredColorKey] = useState<string | null>(null);
  const pendingShopDataRef = useRef<any>(null); 

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const createShop = useShopStore(state => state.createShop);

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

 
  useEffect(() => {
    setCurrentTemplate(initialVariables || {});
    
    // Solo resetear mensajes en la primera inicialización o si cambia el estado de tienda de forma significativa
    if (!hasInitialized) {
      setHasInitialized(true);
      if (!hasShop) {
        setMessages([
          {
            id: 'initial-question-0',
            text: TEMPLATE_QUESTIONS[0],
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
        setCurrentQuestionIndex(0);
      } else {
        // Si tiene tienda desde el inicio, mostrar mensaje de personalización
        setMessages([
          {
            id: 'shop-exists-initial',
            text: "¡Hola! Tu tienda está lista. Puedo ayudarte a personalizar colores, textos y otros aspectos de tu tienda. ¿Qué te gustaría modificar?",
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
      }
      setPendingShopData(null);
      pendingShopDataRef.current = null;
      setInput('');
    }
  }, [initialVariables, hasShop, hasInitialized]);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === '' || isAIThinking) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    // Detectar la última pregunta de la IA
    const lastAIMessage = [...messages].reverse().find(m => m.sender === 'ai');
    let updatedTemplate = { ...currentTemplate };
    if (lastAIMessage) {
      const q = lastAIMessage.text.toLowerCase();
      console.log('[AIChat] Última pregunta IA:', q);
      console.log('[AIChat] Estado pendingShopData:', pendingShopData, 'Ref:', pendingShopDataRef.current);
      if (q.includes('¿cómo se llamará tu tienda?') || q.includes('como se llamara tu tienda')) {
        updatedTemplate.shopName = input;
      } else if (q.includes('¿qué diseño o plantilla prefieres') || q.includes('que diseño o plantilla prefieres')) {
        updatedTemplate.layoutDesign = input;
      } else if (q.includes('¿cuál es el correo de contacto') || q.includes('cual es el correo de contacto')) {
        updatedTemplate.contactEmail = input;
      } else if (q.includes('¿cuál es el teléfono de tu tienda') || q.includes('cual es el telefono de tu tienda')) {
        updatedTemplate.shopPhone = input;
      } else if (q.includes('¿qué subdominio quieres') || q.includes('que subdominio quieres')) {
        updatedTemplate.subdomain = input;
      }
     
      if (
        (q.includes('¿quieres que la cree ahora?') || q.includes('quieres que la cree ahora')) &&
        (pendingShopDataRef.current || pendingShopData) &&
        ['si', 'sí', 'crea', 'ok', 'dale', 'hazlo', 'yes', 'create'].some(word => input.trim().toLowerCase().startsWith(word))
      ) {
        console.log('[AIChat] Confirmación detectada. Llamando a createShop con:', pendingShopDataRef.current || pendingShopData);
        // ...existing code...
      } else if ((q.includes('¿quieres que la cree ahora?') || q.includes('quieres que la cree ahora'))) {
        console.log('[AIChat] Pregunta de confirmación detectada, pero no se cumplen condiciones para crear la tienda. input:', input, 'pendingShopData:', pendingShopDataRef.current || pendingShopData);
     
        console.log('[AIChat] Mensaje completo de la IA:', lastAIMessage);
      }
    }
    setCurrentTemplate(updatedTemplate);

    // Add user message immediately
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsAIThinking(true);

    try {
      
      const aiResponse: { reply: string; templateUpdates: any | null; isFinalStep?: boolean; shopData?: any; shouldCreateShop?: boolean } = await sendChatMessageToAI(updatedMessages, updatedTemplate);
     
      console.log('[AIChat] Respuesta completa del backend:', aiResponse);
      if (aiResponse.isFinalStep && aiResponse.shopData) {
        setPendingShopData(aiResponse.shopData);
        pendingShopDataRef.current = aiResponse.shopData; // 
        console.log('[AIChat] Guardando shopData recibido:', aiResponse.shopData);
      }
     
      if (aiResponse.shouldCreateShop && aiResponse.shopData) {
        console.log('[AIChat] Backend indica crear tienda, llamando a createShop con:', aiResponse.shopData);
        try {
          await createShop(aiResponse.shopData);
          
          // Agregar mensaje de éxito y continuidad en lugar de resetear
          const successMessage: Message = {
            id: Date.now().toString() + '-shop-created',
            text: "¡Excelente! Tu tienda ha sido creada exitosamente. Ahora puedo ayudarte a personalizar colores, textos y otros aspectos. ¿Qué te gustaría modificar?",
            sender: 'ai',
            timestamp: new Date(),
          };
          
          setMessages(prevMessages => [...prevMessages, successMessage]);
          
          if (onChatComplete) onChatComplete({ success: true });
        } catch (e) {
          console.error('[AIChat] Error al crear tienda:', e);
          const errorMessage: Message = {
            id: Date.now().toString() + '-shop-error',
            text: "Hubo un error al crear tu tienda. Por favor, intenta nuevamente.",
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
          if (onChatComplete) onChatComplete({ success: false, error: e });
        }
        setPendingShopData(null);
        pendingShopDataRef.current = null;
        return; // Salir temprano para evitar agregar más mensajes
      }
      // Add AI's conversational reply (solo si no está vacío)
      let messagesToAddAfterReply: Message[] = [];
      
      if (aiResponse.reply && aiResponse.reply.trim() !== '') {
        const newAiMessage: Message = {
          id: Date.now().toString() + '-ai-reply',
          text: aiResponse.reply,
          sender: 'ai',
          timestamp: new Date(),
        };
        messagesToAddAfterReply.push(newAiMessage);
      }

     
      if (aiResponse.templateUpdates && typeof aiResponse.templateUpdates === 'object') {
        // Todos los usuarios (con y sin tienda) ven el modal de confirmación
        // Guardar el template actual antes de aplicar cambios para poder revertir
        setPreviousTemplate({ ...currentTemplate });
        // Aplicar cambios inmediatamente para vista previa
        onApplyTemplateChanges(aiResponse.templateUpdates);
        // También actualizar el template local para la vista previa
        setCurrentTemplate((prev: any) => ({ ...prev, ...aiResponse.templateUpdates }));
        setPendingTemplateUpdate(aiResponse.templateUpdates);
        setShowTemplateModal(true);
      }

    
      if (aiResponse.isFinalStep && aiResponse.shopData) {
        onChatComplete(aiResponse.shopData);
       
        if (!aiResponse.reply.includes('Hemos configurado')) {
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
  // Función para cancelar cambios de template
  const handleCancelTemplateUpdate = () => {
    if (previousTemplate) {
      // Revertir los cambios aplicando el template anterior
      onApplyTemplateChanges(previousTemplate);
      // Revertir también el template local
      setCurrentTemplate(previousTemplate);
    }
    setShowTemplateModal(false);
    setPendingTemplateUpdate(null);
    setPreviousTemplate(null);
  };

  // Confirmar y guardar cambios de template
  const handleConfirmTemplateUpdate = async () => {
    if (!pendingTemplateUpdate) return;
    setSavingTemplate(true);
    setTemplateSaveError(null);
    
    try {
      // El backend ya maneja automáticamente la sincronización de campos
      // relevantes del template con el modelo Shop cuando la tienda existe
      await updateShopTemplate(pendingTemplateUpdate);
      
      // Actualizar el template local
      setCurrentTemplate((prev: any) => ({ ...prev, ...pendingTemplateUpdate }));
      
      // Si hay cambios de nombre de tienda, actualizar el store de Shop
      const user = useAuthStore.getState().user;
      const { getShop } = useShopStore.getState();
      
      if (user?.shop?._id && (pendingTemplateUpdate.title || pendingTemplateUpdate.shopName || pendingTemplateUpdate.storeName)) {
        // Recargar los datos de la tienda para obtener los cambios sincronizados
        try {
          await getShop();
        } catch (shopError) {
          console.error('Error al recargar datos de tienda:', shopError);
        }
      }
      
      onApplyTemplateChanges(pendingTemplateUpdate);
      setShowTemplateModal(false);
      setPendingTemplateUpdate(null);
      setPreviousTemplate(null); // Limpiar el template anterior ya que se confirmaron los cambios
    } catch (err: any) {
      setTemplateSaveError('Error al guardar los cambios.');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Función para remover un cambio específico del template pendiente
  const handleRemoveTemplateChange = (keyToRemove: string) => {
    if (!pendingTemplateUpdate) return;
    
    // Crear una copia del template pendiente sin la clave especificada
    const updatedTemplate = { ...pendingTemplateUpdate };
    delete updatedTemplate[keyToRemove];
    
    // Si el template actualizado está vacío, cerrar el modal
    if (Object.keys(updatedTemplate).length === 0) {
      handleCancelTemplateUpdate();
      return;
    }
    
    // Actualizar el template pendiente
    setPendingTemplateUpdate(updatedTemplate);
    
    // Revertir ese cambio específico en la vista previa aplicando el valor anterior
    if (previousTemplate && previousTemplate[keyToRemove] !== undefined) {
      const revertChange = { [keyToRemove]: previousTemplate[keyToRemove] };
      onApplyTemplateChanges(revertChange);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-bold">Asistente de Creación de Tienda</h3>
            </div>
            <button
              className="ml-2 p-1 rounded hover:bg-[#E04437] transition-colors"
              onClick={toggleChat}
              aria-label="Minimizar chat"
              type="button"
            >
              <FaMinus className="text-white text-lg" />
            </button>
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

      {/* Modal de confirmación de cambios de template */}
      <Modal
        isOpen={showTemplateModal}
        onClose={handleCancelTemplateUpdate}
        title="Confirmar cambios de diseño"
      >
        <div className="mb-4">
          <p className="mb-3">¿Quieres aplicar y guardar estos cambios de diseño en tu tienda?</p>
          
          {pendingTemplateUpdate && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3 max-h-64 overflow-y-auto">
              <h4 className="font-semibold mb-2 text-gray-700 bg-gray-50 pb-1">Cambios a aplicar:</h4>
              <ul className="space-y-1 text-sm">
                {(() => {
                  // Mapear claves técnicas a nombres amigables
                  const friendlyNames: { [key: string]: string } = {
                    navbarTitle: 'Título del navbar',
                    navbarTitleColor: 'Color del título del navbar',
                    navbarLinksColor: 'Color de los enlaces del navbar',
                    navbarIconsColor: 'Color de los iconos del navbar',
                    navbarBackgroundColor: 'Color de fondo del navbar',
                    heroTitle: 'Título principal',
                    heroTitleColor: 'Color del título principal',
                    heroDescription: 'Descripción principal',
                    heroBackgroundColor: 'Color de fondo del hero',
                    categoryTitle: 'Título de categorías',
                    categoryTitleColor: 'Color del título de categorías',
                    featuredProductsTitle: 'Título de productos destacados',
                    featuredProductsTitleColor: 'Color del título de productos',
                    purpleSectionTitle: 'Título de sección especial',
                    purpleSectionTitleColor: 'Color del título de sección especial',
                    newsletterTitle: 'Título del newsletter',
                    newsletterTitleColor: 'Color del título del newsletter',
                    footerTitle: 'Título del footer',
                    footerTitleColor: 'Color del título del footer',
                    footerBackgroundColor: 'Color de fondo del footer',
                    mainBackgroundColor: 'Color de fondo principal',
                    primaryColor: 'Color primario',
                    secondaryColor: 'Color secundario',
                    buttonBackgroundColor: 'Color de fondo de botones',
                    buttonTextColor: 'Color de texto de botones',
                    fontType: 'Tipo de fuente',
                    logoUrl: 'Logo de la tienda',
                    shopName: 'Nombre de la tienda',
                    title: 'Nombre de la tienda',
                    storeName: 'Nombre de la tienda',
                    storeDescription: 'Descripción de la tienda',
                    storeSlogan: 'Eslogan de la tienda'
                  };
                  
                  // Filtrar campos duplicados - solo mostrar uno por tipo
                  const filteredEntries = Object.entries(pendingTemplateUpdate).filter(([key]) => {
                    // Si hay shopName, title y storeName, solo mostrar shopName
                    if (key === 'title' || key === 'storeName') {
                      return !pendingTemplateUpdate.shopName;
                    }
                    return true;
                  });

                  return filteredEntries.map(([key, value]) => {
                    const friendlyName = friendlyNames[key] || key;
                    
                    // Limitar la longitud del texto para evitar overflow
                    const getDisplayValue = (value: any) => {
                      if (typeof value === 'string' && value.startsWith('#')) {
                        // Color picker con valor hex
                        return (
                          <span className="flex items-center gap-2">
                            <div 
                              className="relative"
                              onMouseEnter={() => setHoveredColorKey(key)}
                              onMouseLeave={() => setHoveredColorKey(null)}
                            >
                              <span 
                                className="w-4 h-4 rounded border border-gray-300 inline-block cursor-pointer"
                                style={{ backgroundColor: value }}
                              ></span>
                              {hoveredColorKey === key && (
                                <button
                                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                  onClick={() => handleRemoveTemplateChange(key)}
                                  title="Eliminar este cambio"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{value}</span>
                          </span>
                        );
                      }
                      
                      const stringValue = String(value);
                      if (stringValue.length > 40) {
                        return (
                          <span title={stringValue} className="cursor-help">
                            {stringValue.substring(0, 40)}...
                          </span>
                        );
                      }
                      return stringValue;
                    };
                    
                    return (
                      <li key={key} className="flex justify-between items-start gap-2 group hover:bg-gray-100 px-2 py-2 rounded">
                        <span className="text-gray-600 text-sm font-medium min-w-0 flex-shrink-0">{friendlyName}:</span>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="font-medium text-gray-800 text-sm break-words min-w-0 flex-1 text-right">
                            {getDisplayValue(value)}
                          </span>
                          {/* Botón X para cambios no-color */}
                          {!(typeof value === 'string' && value.startsWith('#')) && (
                            <button
                              className="opacity-0 group-hover:opacity-100 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 flex-shrink-0"
                              onClick={() => handleRemoveTemplateChange(key)}
                              title="Eliminar este cambio"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  });
                })()}
              </ul>
            </div>
          )}
        </div>
        {templateSaveError && <div className="text-red-500 mb-2">{templateSaveError}</div>}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handleCancelTemplateUpdate}
            disabled={savingTemplate}
          >Cancelar</button>
          <button
            className="px-4 py-2 rounded bg-[#FF4F41] text-white hover:bg-[#E04437]"
            onClick={handleConfirmTemplateUpdate}
            disabled={savingTemplate}
          >{savingTemplate ? 'Guardando...' : 'Confirmar'}</button>
        </div>
      </Modal>
    </>
  );
};