// ============================================================
// src/app/ai-demo/page.tsx — AI 演示核心交互页
// 三个 Tab：流式对话 | 文档解析 RAG | Function Calling
// ============================================================
"use client";

import { useState } from "react";
import { MessageSquare, FileText, Wrench } from "lucide-react";
import ChatPanel from "@/components/ChatPanel";
import FileUpload from "@/components/FileUpload";
import FunctionPanel from "@/components/FunctionPanel";
import SectionHeading from "@/components/SectionHeading";
import type { ModelId } from "@/types";

const TABS = [
  { key: "chat", label: "💬 流式对话", icon: MessageSquare },
  { key: "document", label: "📄 文档 RAG", icon: FileText },
  { key: "function", label: "🔧 Function Calling", icon: Wrench },
] as const;

type Tab = (typeof TABS)[number]["key"];

export default function AiDemoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  // 对话参数
  const [model, setModel] = useState<ModelId>("claude-sonnet-4-6");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [jsonMode, setJsonMode] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <SectionHeading
          title="AI 能力演示"
          subtitle="所有 Claude API 调用通过 Node.js 后端代理，前端绝不暴露 API Key。支持 SSE 流式打字机效果、Haiku / Sonnet 模型切换。"
          align="left"
        />
      </section>

      {/* Control Bar */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          {/* Model Select */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">模型</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as ModelId)}
              className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
            </select>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              温度: {temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-20 accent-primary-600"
            />
          </div>

          {/* Max Tokens */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">输出上限</label>
            <select
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={1024}>1K</option>
              <option value={2048}>2K</option>
              <option value={4096}>4K</option>
              <option value={8192}>8K</option>
            </select>
          </div>

          {/* JSON Mode */}
          <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={jsonMode}
              onChange={(e) => setJsonMode(e.target.checked)}
              className="rounded accent-primary-600"
            />
            强制 JSON 输出
          </label>
        </div>
      </section>

      {/* Tab Bar */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 inline-flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="border dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 p-6">
          {activeTab === "chat" && (
            <ChatPanel model={model} temperature={temperature} maxTokens={maxTokens} jsonMode={jsonMode} />
          )}
          {activeTab === "document" && <FileUpload />}
          {activeTab === "function" && <FunctionPanel />}
        </div>
      </section>
    </div>
  );
}
