// ============================================================
// src/components/Footer.tsx
// ============================================================
import Link from "next/link";
import { Code2, Github, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="font-bold text-gray-900 dark:text-white">ClaudeDev.me</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              基于 Next.js 14 + Claude API 构建的<br />
              全栈 AI 开发工程师作品集
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">快捷导航</h3>
            <div className="grid grid-cols-2 gap-1">
              {[
                { href: "/", label: "首页" },
                { href: "/ai-demo", label: "AI 演示" },
                { href: "/projects", label: "作品集" },
                { href: "/about", label: "关于我" },
                { href: "/contact", label: "联系" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">社交链接</h3>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-950 dark:hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-950 dark:hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-500">
          © {year} ClaudeDev.me — Built with Next.js 14 + Anthropic Claude SDK
        </div>
      </div>
    </footer>
  );
}
