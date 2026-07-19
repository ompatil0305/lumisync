import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2, Copy, MessageSquare } from 'lucide-react';

interface Citation {
  id: string;
  title: string;
  url: string;
  source: string;
  content: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export default function Lumi() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Lumi, your intelligent campus assistant. How can I help you navigate Texas Tech today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Where is Holden Hall?",
    "What dining options are open right now?",
    "When does the Fall semester start?",
    "Where should I park as a commuter?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('https://lumisync-production.up.railway.app/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          university_id: 'ttu'
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      if (!response.body) throw new Error('No body in response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages((prev) => 
          prev.map((m) => 
            m.id === assistantMessageId 
              ? { ...m, content: m.content + chunk }
              : m
          )
        );
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => 
        prev.map((m) => 
          m.id === assistantMessageId 
            ? { ...m, content: 'Sorry, I encountered an error connecting to the AI backend. Please ensure the backend is running.' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen max-w-4xl mx-auto pt-20 px-4 md:px-8 pb-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Lumi AI</h1>
            <p className="text-sm text-muted-foreground">Texas Tech Campus Assistant</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ id: '1', role: 'assistant', content: 'Hello! I am Lumi, your intelligent campus assistant. How can I help you navigate Texas Tech today?' }])}
          className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 hide-scrollbar">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {isLoading && message.content === '' && message.role === 'assistant' && (
                  <div className="flex items-center gap-1 h-5">
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>
              
              {message.role === 'assistant' && message.content && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => copyToClipboard(message.content)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Copy size={12} /> Copy
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted text-left transition-colors text-sm font-medium"
            >
              <MessageSquare size={16} className="text-primary shrink-0" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Lumi anything about campus..."
          disabled={isLoading}
          className="w-full bg-muted border border-border rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
