"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/types/ask";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function ChatMessageBubble({
  message,
  isStreaming,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="shrink-0 mt-1">
          <div className="w-7 h-7 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[85%] lg:max-w-[75%] rounded-sm px-4 py-3 shadow-2xl ${
          isUser
            ? "bg-gold/20 border border-gold/30 text-white shadow-gold/5"
            : "bg-[#1a1a1a] border border-white/5 text-gray-100 backdrop-blur-md shadow-black/40"
        }`}
      >
        {isUser ? (
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm prose-invert prose-p:text-gray-100 prose-p:leading-relaxed prose-strong:text-gold prose-headings:text-white prose-headings:font-serif max-w-none prose-p:text-[13px]">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {isStreaming && <span className="inline-block w-1.5 h-4 bg-gold/60 ml-1 animate-pulse" />}
          </div>
        )}

        {isStreaming && !message.content && <TypingIndicator />}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label="Raj Jyotishi is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gold"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) {
  const prompts = {
    "Current Period": [
      "What does my current Jupiter period mean for my career?",
      "When will my Saturn period end?",
    ],
    "Chart Analysis": [
      "Which house is strongest in my chart?",
      "What yogas do I have and what do they mean?",
    ],
    "Life Guidance": [
      "Is this a good time for marriage?",
      "What are my weak areas and how do I strengthen them?",
    ],
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className="p-5 rounded-full bg-gold/10 border border-gold/20 mx-auto w-fit animate-pulse-gold">
          <Sparkles className="w-8 h-8 text-gold/60" />
        </div>
        <h3 className="text-xl font-serif text-white tracking-tight">
          Raj Jyotishi is ready
        </h3>
        <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
          Ask anything about your Kundli — planetary periods, yogas,
          compatibility, timing of events.
        </p>
      </motion.div>

      <div className="w-full max-w-lg space-y-4">
        {Object.entries(prompts).map(([category, suggestions]) => (
          <div key={category} className="space-y-2">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-600">
              {category}
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onPromptClick(prompt)}
                  className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gold/60 border border-gold/15 rounded-sm hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all duration-200 active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
