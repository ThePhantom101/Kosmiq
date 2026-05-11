"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage, ChartContextData, AskRequest } from "@/types/ask";

interface UseChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat(chartContext: ChartContextData | null): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !chartContext || isStreaming) return;

      setError(null);

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const assistantId = createId();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const requestBody: AskRequest = {
          message: text.trim(),
          history: messages.slice(-10),
          chartContext,
        };

        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          if (response.status === 429) {
            setError("Raj Jyotishi is thinking deeply... please wait a moment and try again.");
          } else {
            setError(
              (errorData as { error?: string }).error ??
                "Something went wrong. Please try again."
            );
          }

          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          setIsStreaming(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setError("No response stream available");
          setIsStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();

            try {
              const chunk = JSON.parse(jsonStr) as {
                text?: string;
                done?: boolean;
              };

              if (chunk.done) break;

              if (chunk.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + chunk.text }
                      : m
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        reader.releaseLock();
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError("Connection failed. Please check your network and try again.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [chartContext, isStreaming, messages]
  );

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, error, sendMessage, clearChat };
}
