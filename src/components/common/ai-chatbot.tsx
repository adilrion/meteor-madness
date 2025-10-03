"use client";

import { MeteorShieldChatbot, type ChatMessage } from "@/lib/meteorshield-chatbot";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: MeteorShieldChatbot.processQuery("hello"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = MeteorShieldChatbot.processQuery(input);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform
                             animate-pulse"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            AI
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gray-900 rounded-2xl 
                              shadow-2xl border border-purple-500/30 flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="w-6 h-6 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  MeteorShield AI
                </h3>
                <p className="text-xs text-blue-100">
                  NASA Data Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100 border border-gray-700"
                    }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <div
                    className="text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-blue-400">$1</strong>'
                      ),
                    }}
                  />
                  <div className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl p-3 border border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {MeteorShieldChatbot.getSuggestedQuestions()
                .slice(0, 3)
                .map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleSuggestion(suggestion)
                    }
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 
                                                 px-3 py-1 rounded-full border border-gray-700 transition"
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSend()
                }
                placeholder="Ask about asteroids, safety, or NEO data..."
                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 border border-gray-700
                                         focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-4 py-2
                                         hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

