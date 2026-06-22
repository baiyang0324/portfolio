// ============================================================
// src/app/layout.tsx — 根布局（RSC 服务端组件）
// ============================================================
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "王鼎心个人作品 — Claude 开发工程师",
    template: "%s | 王鼎心个人作品",
  },
  description:
    "独立全栈开发者，专注 Next.js + Claude API 技术栈。展示流式对话、RAG 检索增强生成、Function Calling 等 AI 全栈能力。",
  keywords: [
    "Claude开发工程师",
    "Next.js",
    "AI全栈",
    "RAG",
    "Function Calling",
    "Anthropic Claude",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
