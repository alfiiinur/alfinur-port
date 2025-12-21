/**
 * AI Chat Integration Module
 *
 * This module provides a scalable interface for AI-powered chat responses.
 * You can integrate with various AI providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - Google (Gemini)
 * - Local LLMs (Ollama, etc.)
 *
 * Usage:
 * 1. Set your AI provider credentials in .env
 * 2. Implement the generateResponse function
 * 3. Enable AI in chat session settings
 */

import { prisma } from "./prisma";

// AI Provider types
export type AIProvider =
  | "openai"
  | "anthropic"
  | "gemini"
  | "ollama"
  | "custom";

// Configuration interface
export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// Default system prompt for the chat AI
const DEFAULT_SYSTEM_PROMPT = `Kamu adalah asisten virtual yang ramah dan profesional untuk sebuah perusahaan jasa digital.

Tugas utamamu:
1. Menyambut pengunjung dengan ramah
2. Menjawab pertanyaan tentang layanan yang ditawarkan
3. Memberikan informasi harga jika diminta
4. Mengarahkan ke tim manusia jika pertanyaan terlalu kompleks

Layanan yang ditawarkan:
- Web Development (Landing Page, Company Profile, E-commerce, Custom Web App)
- Mobile App Development (Android, iOS, Cross-platform)
- UI/UX Design
- Branding & Logo Design

Jika tidak yakin dengan jawaban, katakan bahwa kamu akan menghubungkan dengan tim manusia.
Selalu gunakan bahasa Indonesia yang sopan dan profesional.`;

// Get AI configuration from environment
export function getAIConfig(): AIConfig {
  return {
    provider: (process.env.AI_PROVIDER as AIProvider) || "openai",
    apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY,
    model: process.env.AI_MODEL || "gpt-3.5-turbo",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || "500"),
    temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
    systemPrompt: process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT,
  };
}

// Context from previous messages
interface ChatContext {
  sessionId: string;
  visitorName?: string;
  previousMessages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

// Build context from chat session
export async function buildChatContext(
  sessionId: string
): Promise<ChatContext> {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 10, // Last 10 messages for context
      },
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  const previousMessages = session.messages.map(
    (msg: { sender: string; content: string }) => ({
      role: (msg.sender === "VISITOR" ? "user" : "assistant") as
        | "user"
        | "assistant",
      content: msg.content,
    })
  );

  return {
    sessionId,
    visitorName: session.visitorName || undefined,
    previousMessages,
  };
}

/**
 * Generate AI response
 *
 * Implement this function based on your AI provider.
 * Below is a template for OpenAI integration.
 */
export async function generateAIResponse(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const config = getAIConfig();

  // Check if AI is configured
  if (!config.apiKey) {
    console.warn("AI API key not configured");
    return "Maaf, sistem AI sedang tidak tersedia. Tim kami akan segera membalas pesan Anda.";
  }

  try {
    // Example OpenAI implementation
    if (config.provider === "openai") {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: config.systemPrompt },
              ...context.previousMessages,
              { role: "user", content: userMessage },
            ],
            max_tokens: config.maxTokens,
            temperature: config.temperature,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        "Maaf, saya tidak dapat memproses permintaan Anda."
      );
    }

    // Add other providers here (Anthropic, Gemini, etc.)
    // if (config.provider === "anthropic") { ... }
    // if (config.provider === "gemini") { ... }

    return "AI provider tidak dikonfigurasi dengan benar.";
  } catch (error) {
    console.error("AI generation error:", error);
    return "Maaf, terjadi kesalahan. Tim kami akan segera membalas pesan Anda.";
  }
}

/**
 * Process incoming message and optionally generate AI response
 */
export async function processMessageWithAI(
  sessionId: string,
  userMessage: string
): Promise<{ aiResponse: string | null; shouldRespond: boolean }> {
  // Check if AI is enabled for this session
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    select: { isAiEnabled: true },
  });

  if (!session?.isAiEnabled) {
    return { aiResponse: null, shouldRespond: false };
  }

  // Build context and generate response
  const context = await buildChatContext(sessionId);
  const aiResponse = await generateAIResponse(userMessage, context);

  // Save AI response to database
  await prisma.chatMessage.create({
    data: {
      sessionId,
      content: aiResponse,
      sender: "AI",
      metadata: {
        aiGenerated: true,
        model: getAIConfig().model,
      },
    },
  });

  return { aiResponse, shouldRespond: true };
}

/**
 * Quick reply matching
 * Check if user message matches any quick reply shortcuts
 */
export async function matchQuickReply(message: string): Promise<string | null> {
  const normalizedMessage = message.toLowerCase().trim();

  // Get all active quick replies
  const quickReplies = await prisma.quickReply.findMany({
    where: { isActive: true },
  });

  // Check for keyword matches
  const keywords: Record<string, string[]> = {
    pricing: ["harga", "price", "biaya", "tarif", "berapa"],
    services: ["layanan", "jasa", "service", "apa saja"],
    process: ["proses", "cara kerja", "bagaimana", "tahapan"],
  };

  for (const reply of quickReplies) {
    const categoryKeywords = keywords[reply.category];
    if (categoryKeywords?.some((kw) => normalizedMessage.includes(kw))) {
      return reply.content;
    }
  }

  return null;
}
