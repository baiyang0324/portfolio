// ============================================================
// src/app/projects/page.tsx — 作品集页（核心项目展示）
// RSC 服务端组件
// ============================================================

import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectCard as ProjectCardType } from "@/types";

const PROJECTS: ProjectCardType[] = [
  {
    slug: "portfolio-ai",
    title: "Claude 开发工程师个人 AI 站点",
    description:
      "本项目本身即是核心作品——一个从零搭建的 Claude 全栈 AI 应用。基于 Next.js 14 App Router + Anthropic Claude SDK，完整实现 SSE 流式对话、PDF 文档解析与 RAG 问答、Function Calling 工具调用三大 AI 核心能力。全站采用 RSC 服务端组件优先架构，Claude API Key 通过 Node 后端代理，前端零暴露，展示专业级 AI 全栈工程实践。",
    techStack: ["Next.js 14", "TypeScript", "TailwindCSS", "Claude API", "Vercel AI SDK", "Edge Runtime", "RAG", "SSE"],
    features: [
      "SSE 流式打字机效果对话，实时切换 Haiku / Sonnet 模型，支持温度、上下文长度、强制 JSON 输出控制",
      "PDF / Markdown / DOCX 文档上传 → Node 后端自动解析分片 → 关键词索引 → RAG 检索增强流式问答",
      "Function Calling 完整链路演示：Schema 定义 → 本地工具执行 → 结构化结果回传，内置简历匹配与项目总结工具",
      "亮/暗双模式 + 全移动端响应式 + RSC 服务端组件优先 + Edge Runtime 流式接口 + 访客留言 AI 自动总结",
    ],
    github: "https://github.com",
  },
];

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in">
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <SectionHeading
          title="核心作品"
          subtitle="从零独立构建的 Claude 全栈 AI 应用，展示 API 代理、流式输出、RAG、Function Calling 全套工程能力"
          align="left"
        />

        <div className="max-w-2xl mx-auto">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
