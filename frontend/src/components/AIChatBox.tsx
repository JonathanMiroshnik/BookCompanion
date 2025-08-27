import React, { useState, useRef, useEffect } from 'react';
import { aiApi } from '../services/api';
import './AIChatBox.css';

// Types
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: Array<{ bookId: string; passage: string; page?: number; confidence: number }>;
}

interface AIChatBoxProps {
  bookId: string;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ bookId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI reading assistant. I can help you understand this book better, answer questions, and provide insights based on the content. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the real AI API
      const response = await aiApi.queryAI(inputValue.trim(), bookId);
      
      if (response.success && response.data) {
        const aiMessage: Message = {
          id: 'ai_message' + (Date.now() + 1).toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          sources: response.data.sources
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle API error
        const errorMessage: Message = {
          id: 'error_message' + (Date.now() + 1).toString(),
          type: 'ai',
          content: `Sorry, I encountered an error: ${response.error || 'Unknown error'}. Please try again.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorMessage: Message = {
        id: 'error_message' + (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-chat-box">
      <div className="chat-header">
        <h3>🤖 AI Reading Assistant</h3>
        <p>Ask questions about this book and get AI-powered insights!</p>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              <p>{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                  <h4>Sources:</h4>
                  {message.sources.map((source, index) => (
                    <div key={index} className="source-item">
                      <p className="source-passage">"{source.passage}"</p>
                      <div className="source-meta">
                        {source.page && <span>Page {source.page}</span>}
                        <span className="confidence">
                          Confidence: {Math.round(source.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about this book..."
            disabled={isLoading}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        
        <div className="chat-suggestions">
          <p>Try asking:</p>
          <div className="suggestion-chips">
            <button 
              type="button"
              onClick={() => setInputValue('What are the main themes of this book?')}
              className="suggestion-chip"
            >
              What are the main themes?
            </button>
            <button 
              type="button"
              onClick={() => setInputValue('Can you summarize chapter 1?')}
              className="suggestion-chip"
            >
              Summarize chapter 1
            </button>
            <button 
              type="button"
              onClick={() => setInputValue('What does the author say about...?')}
              className="suggestion-chip"
            >
              What does the author say about...?
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AIChatBox;
