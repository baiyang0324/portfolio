// ============================================================
// src/lib/parser.ts — 文件解析工具
// 支持 PDF、Markdown、TXT、Word(.docx) 解析
// ============================================================

/**
 * 解析 PDF 文件 Buffer → 纯文本
 * 使用 pdf-parse 库（基于 Mozilla PDF.js）
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // 动态导入，避免客户端 bundle 包含此模块
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF 解析失败:", error);
    throw new Error("PDF 文件解析失败，请检查文件是否损坏");
  }
}

/**
 * 解析 Word(.docx) Buffer → 纯文本
 */
export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX 解析失败:", error);
    throw new Error("Word 文件解析失败");
  }
}

/**
 * 解析 Markdown 文本（保留原始内容，仅做清理）
 */
export function parseMarkdown(content: string): string {
  // 去除 YAML frontmatter
  return content.replace(/^---[\s\S]*?---\n?/, "").trim();
}

/**
 * 通用文件解析入口：根据 MIME 类型自动选择解析器
 */
export async function parseFile(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (mimeType === "application/pdf" || ext === "pdf") {
    return parsePdf(buffer);
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === "docx") {
    return parseDocx(buffer);
  }
  if (mimeType === "text/markdown" || ext === "md") {
    return buffer.toString("utf-8");
  }
  if (mimeType === "text/plain" || ext === "txt") {
    return buffer.toString("utf-8");
  }

  // 默认尝试作为 UTF-8 文本
  return buffer.toString("utf-8");
}

/**
 * 文本分片：将长文本按指定大小切分为片段
 * 优先在段落边界切分，保持语义完整
 */
export function chunkText(text: string, chunkSize: number = 2000): string[] {
  // 先按段落分割
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // 如果当前段落加入后超出 chunkSize
    if (current.length + trimmed.length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? "\n\n" : "") + trimmed;
    }

    // 单个段落超长则强制拆分
    while (current.length > chunkSize * 1.5) {
      const splitPoint = current.lastIndexOf("\n", chunkSize);
      const cutAt = splitPoint > 0 ? splitPoint : chunkSize;
      chunks.push(current.slice(0, cutAt).trim());
      current = current.slice(cutAt).trim();
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text.slice(0, chunkSize)];
}
