// ============================================================
// src/components/ChatPanel.tsx — 流式多轮对话面板
// ============================================================
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType, ModelId } from "@/types";
import { generateId } from "@/lib/utils";

interface ChatPanelProps {
  model: ModelId;
  temperature: number;
  maxTokens: number;
  jsonMode: boolean;
}

export default function ChatPanel({ model, temperature, maxTokens, jsonMode }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 你好！我是运行在本站点后端的 Claude 助手。\n\n我可以帮你：\n- 解答 Claude API 开发问题\n- 对上传的文档进行 RAG 问答\n- 演示 Function Calling 工具调用\n- 展示流式 SSE 输出\n\n请随时提问！",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // 发送消息
  const handleSend = useCallback(async () => {
    if (!input.trim() || streaming) return;

    const userMsg: ChatMessageType = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model,
          temperature,
          maxTokens,
          jsonMode,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "text") {
              fullContent += data.content;
              setStreamingContent(fullContent);
            } else if (data.type === "done") {
              // 完成
            } else if (data.type === "error") {
              fullContent += `\n\n❌ 错误：${data.content}`;
              setStreamingContent(fullContent);
            }
          } catch {
            // 忽略解析失败的行
          }
        }
      }

      // 添加到消息列表
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: fullContent,
          timestamp: Date.now(),
        },
      ]);
      setStreamingContent("");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "未知错误";
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: `❌ 请求失败：${errMsg}\n\n请检查后端服务是否正常运行。`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, messages, model, temperature, maxTokens, jsonMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "对话已清空，有什么新的问题吗？",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b dark:border-gray-800">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">流式对话</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            模型：{model} | 温度：{temperature} | 输出上限：{maxTokens} | {jsonMode ? "JSON模式" : "自由文本"}
          </p>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          title="清空对话"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* 流式输出中的临时气泡 */}
        {streamingContent && (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="chat-bubble-ai">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {streamingContent}
              </div>
              <span className="cursor-blink" />
            </div>
          </div>
        )}

        {streaming && !streamingContent && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 animate-fade-in">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Claude 正在思考...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t dark:border-gray-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter 发送..."
            disabled={streaming}
            className="flex-1 px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          >
            {streaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Bot = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
  </svg>
);
