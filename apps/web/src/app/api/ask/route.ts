import { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/utils/gemini-prompt";
import type { AskRequest, ChatMessage } from "@/types/ask";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_HISTORY = 10;

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Gemini API key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: AskRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { message, history, chartContext } = body;

  if (!message?.trim()) {
    return new Response(
      JSON.stringify({ error: "Message is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = buildSystemPrompt(chartContext);

  const recentHistory = history.slice(-MAX_HISTORY);
  const contents: GeminiContent[] = recentHistory.map(
    (msg: ChatMessage) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })
  );

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

  try {
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);

      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limited" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to get response from Raj Jyotishi" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const text =
                  parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed SSE chunks
              }
            }
          }
        } finally {
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Ask API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
