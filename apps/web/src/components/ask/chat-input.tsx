"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  disabled: boolean;
}

export function ChatInput({ onSend, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isStreaming && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
    resetHeight();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function resetHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  return (
    <div className="border-t border-gold/10 bg-black/80 backdrop-blur-sm p-3 lg:p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <label htmlFor="ask-input" className="sr-only">
            Ask Raj Jyotishi about your chart
          </label>
          <textarea
            ref={textareaRef}
            id="ask-input"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "Generate a chart to start chatting..."
                : "Ask Raj Jyotishi about your chart..."
            }
            disabled={disabled || isStreaming}
            rows={1}
            aria-label="Chat message input"
            aria-describedby="ask-input-hint"
            className="w-full bg-[#0a0a0a] border border-gold/20 rounded-sm px-4 py-3 text-white text-sm font-sans leading-relaxed resize-none focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ minHeight: "44px" }}
          />
          <span id="ask-input-hint" className="sr-only">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="Send message"
          className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-sm border transition-all duration-200 ${
            canSend
              ? "bg-gold/20 border-gold/30 text-gold hover:bg-gold/30 hover:border-gold/50 active:scale-95"
              : "bg-gold/5 border-gold/10 text-gold/30 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {isStreaming && (
        <p
          className="text-center text-[10px] uppercase tracking-widest text-gold/40 font-mono mt-2"
          role="status"
          aria-live="polite"
        >
          Raj Jyotishi is responding...
        </p>
      )}
    </div>
  );
}
