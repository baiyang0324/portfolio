// ============================================================
// src/components/FileUpload.tsx — PDF/MD 文件上传与文档问答
// ============================================================
"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Search, X } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chunks, setChunks] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // 类型校验
    const allowed = ["application/pdf", "text/markdown", "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|md|txt|docx)$/i)) {
      alert("仅支持 PDF、Markdown、TXT、DOCX 文件");
      return;
    }

    setFile(f);
    setAnswer("");
    setUploading(true);

    // 上传文件到后端解析并建立 RAG 索引
    const formData = new FormData();
    formData.append("file", f);

    try {
      const res = await fetch("/api/document", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setChunks(data.chunks || 0);
      } else {
        alert("文档解析失败：" + data.error);
      }
    } catch (err) {
      alert("上传失败：" + (err instanceof Error ? err.message : "网络错误"));
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || !file) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/document", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      // SSE 流式读取
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const d = JSON.parse(line.slice(6));
            if (d.type === "text") full += d.content;
            else if (d.type === "error") full += `\n❌ ${d.content}`;
          } catch { /* skip */ }
        }
        setAnswer(full);
      }
    } catch (err) {
      setAnswer("请求失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">📄 文档解析 & RAG 问答</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        上传 PDF / Markdown / TXT / DOCX 文件，后端自动分片建立索引，支持基于文档内容的 RAG 问答
      </p>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.md,.txt,.docx" onChange={handleFileChange} className="hidden" />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-sm">
            <FileText className="w-5 h-5 text-primary-500" />
            <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
            <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setAnswer(""); }}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-gray-400 group-hover:text-primary-500 transition-colors">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">点击上传文件</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          正在解析文档并建立索引...
        </div>
      )}

      {chunks > 0 && (
        <p className="text-xs text-green-600 dark:text-green-400">
          ✅ 文档已索引，共 {chunks} 个片段。可以开始提问了！
        </p>
      )}

      {/* Question Input */}
      {file && (
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="针对文档内容提问..."
            className="flex-1 px-4 py-2 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || loading}
            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}
