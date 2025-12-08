"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/lib/ai/gemini";

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm Sabuji, your customer support assistant for The Grand. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our customer service team directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-emerald text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Open chat support"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Sabuji</h3>
                  <p className="text-xs text-emerald-100">The Grand AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/30">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-emerald text-white"
                        : "bg-white text-charcoal border border-charcoal/10"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-emerald" />
                      )}
                      {message.role === "user" && (
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-charcoal border border-charcoal/10 rounded-2xl p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-emerald" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-charcoal/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-charcoal/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-charcoal/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-charcoal/10 p-4 bg-white">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald text-white p-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-charcoal/50 mt-2 text-center">
                Powered by Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

