"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trash2, AlertCircle } from "lucide-react";
import { useAstro } from "@/context/AstroContext";
import { useDasha } from "@/hooks/useDasha";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import Link from "next/link";
import { buildChartContext } from "@/utils/chart-context-builder";
import { ChartContextPanel } from "@/components/ask/chart-context-panel";
import {
  ChatMessageBubble,
  EmptyState,
} from "@/components/ask/chat-messages";
import { ChatInput } from "@/components/ask/chat-input";

export default function AskPage() {
  const { isAuthenticated } = useSession();
  const { data: astroData, isLoading: astroLoading } = useAstro();
  const { data: dashaData, isLoading: dashaLoading } = useDasha();

  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chartContext = useMemo(
    () => buildChartContext(astroData, dashaData),
    [astroData, dashaData]
  );

  const { messages, isStreaming, error, sendMessage, clearChat } =
    useChat(chartContext);

  const isContextLoading = astroLoading || dashaLoading;
  const hasChart = chartContext !== null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handlePromptClick(prompt: string) {
    sendMessage(prompt);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-8 -mt-8 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 lg:px-8 py-4 border-b border-gold/10 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-gold/10 border border-gold/20">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h1 className="text-lg font-serif text-white tracking-tight">
                Raj Jyotishi
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                Vedic Astrology Expert
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Link
                href="/login?next=/ask"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-[9px] uppercase tracking-widest font-bold text-gold/60 hover:text-gold border border-gold/10 hover:border-gold/30 rounded-sm transition-all"
              >
                Sign In to Save History
              </Link>
            )}

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                aria-label="Clear chat history"
                className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gray-600 hover:text-red-400 border border-transparent hover:border-red-400/20 rounded-sm transition-all"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body: Context Panel + Chat */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile context strip */}
        <div className="lg:hidden shrink-0 px-4 py-2">
          <ChartContextPanel
            context={chartContext}
            isLoading={isContextLoading}
            isMobileExpanded={mobileContextOpen}
            onToggleMobile={() => setMobileContextOpen((o) => !o)}
          />
        </div>

        {/* Desktop context sidebar */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 border-r border-gold/10 bg-black/40 overflow-hidden">
          <ChartContextPanel
            context={chartContext}
            isLoading={isContextLoading}
            isMobileExpanded={false}
            onToggleMobile={() => {}}
          />
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-4 scroll-smooth">
            {messages.length === 0 ? (
              <EmptyState onPromptClick={handlePromptClick} />
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <ChatMessageBubble
                      key={msg.id}
                      message={msg}
                      isStreaming={
                        isStreaming &&
                        msg.role === "assistant" &&
                        msg.id === messages[messages.length - 1]?.id
                      }
                    />
                  ))}
                </AnimatePresence>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-sm max-w-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300/80 leading-relaxed">
                      {error}
                    </p>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0">
            <ChatInput
              onSend={sendMessage}
              isStreaming={isStreaming}
              disabled={!hasChart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
