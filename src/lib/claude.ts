// ============================================================
// src/lib/claude.ts — Anthropic Claude SDK 封装
// 所有 Claude API 调用都通过此文件，前端绝不暴露 API Key
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import type { ModelId } from "@/types";

// 单例：避免每次请求都 new client
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
      // 如需代理: baseURL: process.env.ANTHROPIC_BASE_URL,
    });
  }
  return client;
}

/** 系统提示词 — 统一人设 */
const SYSTEM_PROMPT = `你是一位资深 Claude 开发工程师助手，运行在本作品集站点后端。
你的职责是：
1. 解答有关 Claude API、Vercel AI SDK、Next.js 全栈开发的提问
2. 展示流式对话、文档解析、RAG、Function Calling 等技术能力
3. 帮助访客了解站长的技术实力
请用中文回答，代码示例使用 TypeScript，风格专业但友好。`;

interface StreamChatOptions {
  messages: { role: "user" | "assistant"; content: string }[];
  model?: ModelId;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

/**
 * 流式对话 — 返回 ReadableStream 供 SSE 消费
 * 使用 Anthropic SDK 的 streaming API
 */
export async function streamChat(options: StreamChatOptions): Promise<ReadableStream> {
  const claude = getClient();
  const {
    messages,
    model = "claude-sonnet-4-6",
    temperature = 0.7,
    maxTokens = 4096,
    jsonMode = false,
  } = options;

  // 预处理系统消息
  let systemPrompt = SYSTEM_PROMPT;
  if (jsonMode) {
    systemPrompt += "\n\n重要：你的回复必须是纯 JSON 格式，不要包含任何 markdown 代码块标记。";
  }

  const stream = await claude.messages.stream({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  // 将 Anthropic SSE 流转换为标准 ReadableStream
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const chunk = JSON.stringify({ type: "text", content: event.delta.text });
            controller.enqueue(new TextEncoder().encode(`data: ${chunk}\n\n`));
          }
        }
        // 发送结束信号
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify({ type: "error", content: errMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });
}

/**
 * 非流式对话 — 用于文档总结、Function Calling 等场景
 */
export async function chat(options: StreamChatOptions): Promise<string> {
  const claude = getClient();
  const {
    messages,
    model = "claude-sonnet-4-6",
    temperature = 0.7,
    maxTokens = 4096,
    jsonMode = false,
  } = options;

  let systemPrompt = SYSTEM_PROMPT;
  if (jsonMode) {
    systemPrompt += "\n\n重要：你的回复必须是纯 JSON 格式，不要包含任何 markdown 代码块标记。";
  }

  const response = await claude.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}

/**
 * 带工具定义的对话 — 用于 Function Calling
 */
export async function chatWithTools(
  messages: { role: "user" | "assistant"; content: string }[],
  tools: Anthropic.Tool[],
  model: ModelId = "claude-sonnet-4-6"
): Promise<Anthropic.Messages.Message> {
  const claude = getClient();
  return claude.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    tools,
  });
}
