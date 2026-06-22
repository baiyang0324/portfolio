// ============================================================
// src/app/page.tsx — 首页：个人简介 + 技能标签 + 快捷跳转 + 站点技术栈
// RSC 服务端组件（默认无 'use client'）
// ============================================================

import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  FolderOpen,
  User,
  Mail,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import SkillBadge from "@/components/SkillBadge";

const TECH_SKILLS = [
  "Next.js 14", "TypeScript", "React 18", "TailwindCSS",
  "Node.js", "API Route", "RSC", "Edge Runtime",
  "Claude API", "Vercel AI SDK", "SSE 流式", "RAG",
  "Function Calling", "Prompt Engineering", "PDF 解析", "Vector Search",
];

const SITE_TECH = [
  { label: "框架", value: "Next.js 14 App Router (RSC)" },
  { label: "语言", value: "TypeScript 5.x" },
  { label: "样式", value: "TailwindCSS 3.4 + 亮暗模式" },
  { label: "AI SDK", value: "Vercel AI SDK + Anthropic Claude SDK" },
  { label: "运行时", value: "Edge Runtime (SSE) + Node.js Runtime" },
  { label: "包管理", value: "npm" },
];

const QUICK_LINKS = [
  { href: "/ai-demo", icon: MessageSquare, label: "AI 演示", desc: "流式对话 · RAG · Function Calling", color: "text-primary-600 bg-primary-100 dark:bg-primary-950" },
  { href: "/projects", icon: FolderOpen, label: "作品集", desc: "Claude 全栈 AI 个人站点", color: "text-accent-600 bg-accent-100 dark:bg-accent-950" },
  { href: "/about", icon: User, label: "关于我", desc: "技能栈 · 时间线 · 简历", color: "text-orange-600 bg-orange-100 dark:bg-orange-950" },
  { href: "/contact", icon: Mail, label: "联系我", desc: "邮箱 · 留言表单", color: "text-purple-600 bg-purple-100 dark:bg-purple-950" },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* ========== Hero Section ========== */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 text-sm text-primary-700 dark:text-primary-300 mb-6 animate-slide-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500" />
            </span>
            求职中 · Claude 开发工程师
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Claude 开发工程师
            <br />
            <span className="text-primary-600 dark:text-primary-400">全栈 AI 应用构建者</span>
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            独立使用 Next.js 14 + Anthropic Claude SDK 完整落地全套 AI 应用。
            掌握 API 代理、长文本分片、RAG 检索增强生成、Function Calling、SSE 流式输出等核心技术。
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/ai-demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-lg shadow-primary-500/25"
            >
              在线演示 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
            >
              查看作品集
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Tech Stack Section ========== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <SectionHeading
          title="站点技术栈说明"
          subtitle="本网站本身就是一件作品：从零搭建的全栈 AI 应用，所有代码可直接运行"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SITE_TECH.map((tech) => (
            <div key={tech.label}
              className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{tech.label}</span>
              <span className="text-sm text-gray-900 dark:text-white font-mono">{tech.value}</span>
            </div>
          ))}
        </div>

        {/* Skill Tags */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">核心技术能力</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {TECH_SKILLS.map((skill) => (
              <SkillBadge key={skill} label={skill} variant="primary" />
            ))}
          </div>
        </div>
      </section>

      {/* ========== Quick Links Section ========== */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <SectionHeading title="快速访问" subtitle="探索站点的每个功能模块" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}
                className="group p-5 rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${link.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{link.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
