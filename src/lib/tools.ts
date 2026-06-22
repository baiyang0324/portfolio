// ============================================================
// src/lib/tools.ts — Function Calling 本地工具函数
// 内置两个演示工具：简历匹配 + 项目总结
// ============================================================

/**
 * 工具 1: 简历匹配
 * 根据输入的 JD（职位描述）关键词，匹配简历中的对应能力
 */
export interface ResumeMatchInput {
  jdKeywords: string[];    // JD 中的关键词列表
  positionName: string;    // 目标岗位名称
}

export interface ResumeMatchOutput {
  overallScore: number;           // 0-100 综合匹配度
  matchedSkills: { skill: string; score: number }[];
  missingSkills: string[];
  suggestion: string;
}

export function resumeMatch(input: ResumeMatchInput): ResumeMatchOutput {
  // 简历技能库（模拟）
  const skillDB: Record<string, number> = {
    // AI / LLM
    "claude api": 90,
    "anthropic": 90,
    "openai": 75,
    "llm": 85,
    "rag": 85,
    "function calling": 80,
    "sse": 80,
    "streaming": 80,
    "embedding": 70,
    "prompt engineering": 85,
    // 前端
    "next.js": 90,
    "react": 88,
    "typescript": 90,
    "tailwindcss": 85,
    "rsc": 80,
    "app router": 85,
    // 后端
    "node.js": 90,
    "api route": 85,
    "middleware": 75,
    "postgresql": 70,
    "redis": 60,
    // DevOps
    "vercel": 85,
    "docker": 70,
    "nginx": 65,
    "git": 85,
    "ci/cd": 70,
  };

  const jdLower = input.jdKeywords.map((k) => k.toLowerCase());
  const matched: ResumeMatchOutput["matchedSkills"] = [];
  const missing: string[] = [];

  for (const kw of jdLower) {
    // 精确或部分匹配
    const found = Object.entries(skillDB).find(
      ([skill]) => skill.includes(kw) || kw.includes(skill)
    );
    if (found) {
      matched.push({ skill: found[0], score: found[1] });
    } else {
      missing.push(kw);
    }
  }

  // 计算总分
  const avgScore =
    matched.length > 0
      ? matched.reduce((sum, m) => sum + m.score, 0) / matched.length
      : 50;

  // 缺失扣分
  const penalty = (missing.length / Math.max(jdLower.length, 1)) * 30;
  const overallScore = Math.round(Math.max(0, Math.min(100, avgScore - penalty)));

  return {
    overallScore,
    matchedSkills: matched,
    missingSkills: missing,
    suggestion:
      overallScore >= 80
        ? `简历与"${input.positionName}"岗位高度匹配，建议重点展示 AI 全栈项目经验。`
        : overallScore >= 60
          ? `基本匹配"${input.positionName}"岗位，建议补充: ${missing.slice(0, 5).join("、")}。`
          : `与"${input.positionName}"岗位差距较大，建议系统学习: ${missing.slice(0, 5).join("、")}。`,
  };
}

/**
 * 工具 2: 项目总结生成
 * 根据输入的项目信息，生成结构化的项目描述
 */
export interface ProjectSummaryInput {
  name: string;
  techStack: string[];
  description: string;
  highlights: string[];
}

export interface ProjectSummaryOutput {
  summary: string;          // 一段话总结
  points: string[];         // 亮点分点
  skills: string[];         // 涉及技能
  difficulty: "入门" | "中级" | "高级" | "专家";
}

export function projectSummary(input: ProjectSummaryInput): ProjectSummaryOutput {
  const techComplexity: Record<string, number> = {
    "react": 3, "vue": 3, "next.js": 5, "nuxt": 5,
    "typescript": 4, "javascript": 2,
    "node.js": 4, "express": 3, "nestjs": 5,
    "claude api": 6, "openai api": 5, "langchain": 7,
    "rag": 7, "vector db": 7, "embedding": 6,
    "redis": 4, "postgresql": 4, "mongodb": 3,
    "docker": 5, "kubernetes": 8, "aws": 6,
    "tailwindcss": 2, "prisma": 4,
  };

  // 计算技术复杂度
  const maxComplexity = Math.max(
    ...input.techStack.map((t) => techComplexity[t.toLowerCase()] || 3)
  );

  let difficulty: ProjectSummaryOutput["difficulty"];
  if (maxComplexity >= 7) difficulty = "专家";
  else if (maxComplexity >= 5) difficulty = "高级";
  else if (maxComplexity >= 3) difficulty = "中级";
  else difficulty = "入门";

  const summary = `${input.name} 是一个基于 ${input.techStack.slice(0, 5).join(" + ")} 的全栈项目。${input.description}`;

  const points = input.highlights.map((h, i) => `${i + 1}. ${h}`);

  const skills = input.techStack.map((t) => t.toLowerCase());

  return { summary, points, skills, difficulty };
}
