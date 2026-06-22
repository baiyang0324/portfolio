// ============================================================
// src/lib/rag.ts — 简易本地 RAG（检索增强生成）
// 基于文本分片的向量化检索（使用 keyword + TF-IDF 近似）
// 生产环境可替换为真正的 embedding + vector DB
// ============================================================

import { chunkText } from "./parser";

interface Chunk {
  id: number;
  text: string;
  /** 简单的关键词权重索引 */
  keywords: Map<string, number>;
}

/** 内存文档存储（生产可替换为向量数据库） */
let documentStore: Chunk[] = [];
let storeInitialized = false;

/**
 * 初始化 RAG 文档库
 * @param text 文档全文
 * @param chunkSize 分片大小
 */
export function initRagStore(text: string, chunkSize: number = 2000): void {
  const rawChunks = chunkText(text, chunkSize);
  documentStore = rawChunks.map((text, idx) => ({
    id: idx,
    text,
    keywords: buildKeywordIndex(text),
  }));
  storeInitialized = true;
}

/**
 * 构建关键词权重索引（简化版 TF）
 */
function buildKeywordIndex(text: string): Map<string, number> {
  const keywords = new Map<string, number>();
  // 中文按字符+双字组合，英文按单词
  const normalized = text.toLowerCase();

  // 提取英文单词
  const words = normalized.match(/\b[a-z][a-z0-9_]{2,}\b/g) || [];
  for (const w of words) {
    keywords.set(w, (keywords.get(w) || 0) + 1);
  }

  // 提取中文双字组合
  const cjk = normalized.match(/[一-鿿]{2,}/g) || [];
  for (const phrase of cjk) {
    for (let i = 0; i < phrase.length - 1; i++) {
      const bigram = phrase.slice(i, i + 2);
      keywords.set(bigram, (keywords.get(bigram) || 0) + 1);
    }
  }

  return keywords;
}

/**
 * 检索与查询最相关的文档片段
 * 使用余弦相似度的近似计算（基于关键词重叠）
 */
export function searchChunks(query: string, topK: number = 3): string[] {
  if (!storeInitialized || documentStore.length === 0) {
    return ["文档库为空，请先上传文档。"];
  }

  const queryKeywords = buildKeywordIndex(query);

  // 计算每个 chunk 与 query 的相似度
  const scored = documentStore.map((chunk) => {
    let score = 0;
    queryKeywords.forEach((qWeight, keyword) => {
      const cWeight = chunk.keywords.get(keyword) || 0;
      if (cWeight > 0) {
        score += Math.sqrt(qWeight * cWeight);
      }
    });
    return { chunk, score };
  });

  // 按分数排序取 topK
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map((s) => s.chunk.text);
}

/**
 * 构建 RAG 增强的提示词
 */
export function buildRagPrompt(query: string, contexts: string[]): string {
  const contextBlock = contexts
    .map((c, i) => `[文档片段 ${i + 1}]\n${c}`)
    .join("\n\n");

  return `你是一个基于文档的问答助手。请根据以下文档内容回答问题。
如果文档中没有相关信息，请如实说明，不要编造。

${contextBlock}

---
用户问题：${query}

请根据以上文档内容给出准确、详细的回答：`;
}

/** 清空 RAG 存储 */
export function clearRagStore(): void {
  documentStore = [];
  storeInitialized = false;
}
