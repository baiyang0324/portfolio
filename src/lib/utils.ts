// ============================================================
// src/lib/utils.ts — 通用工具函数
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind 类名合并（解决优先级冲突） */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** 生成唯一 ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 格式化日期 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 计算阅读时间（分钟） */
export function readingTime(text: string): number {
  const wordsPerMinute = 300; // 中文字均阅读速度
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / wordsPerMinute));
}

/** 截断文本 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/** 从文件名获取 MIME 类型 */
export function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    md: "text/markdown",
    txt: "text/plain",
    json: "application/json",
    csv: "text/csv",
  };
  return map[ext || ""] || "application/octet-stream";
}

/** 安全解析 JSON（从可能含 markdown 代码块的 Claude 响应中提取） */
export function safeParseJson(text: string): unknown | null {
  try {
    // 尝试直接解析
    return JSON.parse(text);
  } catch {
    // 尝试提取 markdown 代码块中的 JSON
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}
