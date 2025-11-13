import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load messages from localStorage on initial render
    try {
      const storedMessages = localStorage.getItem('chatHistory');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Add a default welcome message if no history exists
        setMessages([
          { id: 1, text: 'Olá! Sou o assistente virtual do SGO. Como posso ajudar?', sender: 'ai' }
        ]);
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      setMessages([
        { id: 1, text: 'Olá! Sou o assistente virtual do SGO. Como posso ajudar?', sender: 'ai' }
      ]);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (messages.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
    // Scroll to the bottom of the chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
        // Focus the input when the chat opens
        setTimeout(() => inputRef.current?.focus(), 300); // Delay to allow for transition
    }
  }, [isOpen]);

  const simulateFunctionCall = (userInput: string): string | null => {
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes('fatura') || lowerCaseInput.includes('pagamento')) {
      return "Percebi que precisa de ajuda com uma fatura. Posso abrir um ticket de suporte sobre finanças para si?";
    }
    if (lowerCaseInput.includes('relatório') || lowerCaseInput.includes('dashboard')) {
      return "Parece que tem uma dúvida sobre relatórios. Pode especificar qual é a sua dificuldade?";
    }
    return null;
  }

  const getGenericResponse = (): string => {
    const responses = [
        "Não tenho a certeza de como ajudar com isso. Pode reformular a pergunta?",
        "Entendido. A nossa equipa de suporte entrará em contacto em breve.",
        "Para problemas complexos, por favor, utilize o módulo de Ocorrências para abrir um ticket formal.",
        "Obrigado pelo seu contacto. Há mais alguma coisa em que posso ajudar?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.message;
    const userInput = input.value.trim();

    if (!userInput) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    input.value = '';
    setIsTyping(true);

    // Simulate API call and response
    setTimeout(() => {
      const functionCallResponse = simulateFunctionCall(userInput);
      const aiResponseText = functionCallResponse || getGenericResponse();

      const newAiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
      };
      setIsTyping(false);
      setMessages(prev => [...prev, newAiMessage]);
    }, 1500 + Math.random() * 500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-float-button"
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat de suporte'}
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </button>

      {/* Chat Widget */}
      <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="flex items-center space-x-3">
            <Bot className="h-7 w-7 text-white" />
            <div>
                <h3 className="font-bold text-lg">Assistente SGO</h3>
                <p className="text-xs text-blue-200">Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-blue-700">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-container ${msg.sender === 'user' ? 'user' : 'ai'}`}
            >
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="message-container ai">
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            name="message"
            placeholder="Escreva a sua mensagem..."
            autoComplete="off"
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-button" aria-label="Enviar mensagem">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatbotWidget;