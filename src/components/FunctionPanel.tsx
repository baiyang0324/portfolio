// ============================================================
// src/components/FunctionPanel.tsx — Function Calling 演示面板
// ============================================================
"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle, XCircle } from "lucide-react";

const TOOLS = [
  {
    name: "resume_match",
    label: "📋 简历匹配",
    description: "输入 JD 关键词，评估简历与目标岗位的匹配度",
    defaultArgs: {
      jdKeywords: ["Next.js", "TypeScript", "Claude API", "RAG", "Node.js"],
      positionName: "Claude 开发工程师",
    },
  },
  {
    name: "project_summary",
    label: "📝 项目总结",
    description: "根据项目信息生成结构化项目描述",
    defaultArgs: {
      name: "AI Portfolio Builder",
      techStack: ["Next.js 14", "TypeScript", "Claude API", "TailwindCSS", "Vercel AI SDK"],
      description: "一个展示 Claude 全栈 AI 能力的个人作品集网站",
      highlights: ["流式 SSE 对话", "PDF 文档 RAG 问答", "Function Calling 工具集成", "亮暗模式响应式设计"],
    },
  },
];

export default function FunctionPanel() {
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]);
  const [args, setArgs] = useState(JSON.stringify(TOOLS[0].defaultArgs, null, 2));
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExecute = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let parsedArgs: Record<string, unknown>;
      try {
        parsedArgs = JSON.parse(args);
      } catch {
        setError("JSON 参数格式错误");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/function", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedTool.name,
          args: parsedArgs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "执行失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">🔧 Function Calling 演示</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        内置 2 个本地工具函数，展示 Claude Tool Use 的完整调用链路：前端 → API Route → 本地函数执行 → 返回结果
      </p>

      {/* Tool Select */}
      <div className="flex gap-2 flex-wrap">
        {TOOLS.map((tool) => (
          <button
            key={tool.name}
            onClick={() => {
              setSelectedTool(tool);
              setArgs(JSON.stringify(tool.defaultArgs, null, 2));
              setResult(null);
              setError("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTool.name === tool.name
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Tool Description */}
      <div className="bg-accent-50 dark:bg-accent-950 border border-accent-200 dark:border-accent-800 rounded-lg p-3">
        <p className="text-sm text-accent-700 dark:text-accent-300">
          <strong>{selectedTool.name}</strong> — {selectedTool.description}
        </p>
      </div>

      {/* Args Editor */}
      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          参数 (JSON)
        </label>
        <textarea
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          rows={8}
          className="w-full mt-1 px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y transition-colors"
        />
      </div>

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white font-medium text-sm transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        执行工具调用
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg p-3">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">执行结果</span>
          </div>
          <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
