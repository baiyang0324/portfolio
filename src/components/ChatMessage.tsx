// ============================================================
// src/components/ChatMessage.tsx — 聊天消息气泡
// ============================================================
"use client";

import { User, Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ChatMessage as ChatMessageType } from "@/types";

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-fade-in`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? "bg-accent-500" : "bg-primary-500"
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Content */}
      <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, node, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeStr = String(children).replace(/\n$/, "");
                  const inline = !match && !String(children).includes("\n");

                  if (inline) {
                    return <code className={className} {...props}>{children}</code>;
                  }

                  return (
                    <div className="relative my-3">
                      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-800 dark:bg-gray-900 rounded-t-lg text-xs text-gray-400">
                        <span>{match?.[1] || "code"}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(codeStr);
                          }}
                          className="hover:text-white transition-colors"
                        >
                          复制
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match?.[1] || "text"}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: "0 0 0.75rem 0.75rem" }}
                      >
                        {codeStr}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Actions */}
        <div className={`flex items-center gap-2 mt-2 ${isUser ? "justify-end" : ""}`}>
          <span className="text-xs opacity-50">
            {new Date(message.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && (
            <button onClick={handleCopy} className="text-xs opacity-50 hover:opacity-100 transition-opacity">
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
