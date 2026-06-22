// ============================================================
// src/types/index.ts — 全局类型定义
// ============================================================

/** 支持的 Claude 模型 */
export type ModelId = "claude-haiku-4-5-20251001" | "claude-sonnet-4-6";

/** 聊天消息 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

/** 流式对话请求体 */
export interface ChatRequest {
  messages: ChatMessage[];
  model?: ModelId;
  temperature?: number;   // 0 ~ 1
  maxTokens?: number;     // 最大输出长度
  jsonMode?: boolean;     // 是否强制 JSON 输出
}

/** 文档上传请求（由 FormData 承载，此处为字段说明） */
export interface DocumentRequest {
  file: File;
  question?: string;      // 可选提问
  chunkSize?: number;     // 分片大小，默认 2000
}

/** Function Calling 工具定义 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

/** 工具调用请求 */
export interface FunctionCallRequest {
  tool: string;           // 工具名称
  args: Record<string, unknown>;
  messages?: ChatMessage[];
}

/** 联系表单 */
export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  content: string;
}

/** 项目卡片数据 */
export interface ProjectCard {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  link?: string;
  github?: string;
}

/** 技能项 */
export interface Skill {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "ai" | "devops";
}
