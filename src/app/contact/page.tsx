// ============================================================
// src/app/contact/page.tsx — 联系页：邮箱 + 留言表单 + AI 总结
// ============================================================
"use client";

import { useState } from "react";
import { Mail, ExternalLink, Send, Loader2, CheckCircle, Sparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const QQ_EMAIL = "2975176088@qq.com";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; summary?: string; mailSent?: boolean } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, message: data.message, summary: data.summary, mailSent: data.mailSent });
        setForm({ name: "", email: "", subject: "", content: "" });
      } else {
        setResult({ success: false, message: data.error || "发送失败" });
      }
    } catch {
      setResult({ success: false, message: "网络错误，请稍后重试" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-16">
        <SectionHeading
          title="联系我"
          subtitle="欢迎通过邮箱或留言表单与我取得联系"
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 邮箱联系方式 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">联系方式</h3>
            <a
              href="https://mail.qq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors group"
            >
              <div className="p-2.5 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">QQ 邮箱</p>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{QQ_EMAIL}</p>
              </div>
            </a>
          </div>

          {/* 留言表单 */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名 *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="你的名字"
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱 *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">主题 *</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="留言主题"
                  className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">内容 *</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="写下你想说的话..."
                  className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "发送中..." : "发送留言"}
              </button>
            </form>

            {/* 提交结果 */}
            {result && (
              <div
                className={`mt-6 p-4 rounded-xl border animate-fade-in ${
                  result.success
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <span className="text-red-500 flex-shrink-0 mt-0.5">❌</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.message}</p>
                    {result.summary && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Sparkles className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span>AI 总结：{result.summary}</span>
                      </div>
                    )}
                    {result.mailSent && (
                      <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                        📧 已发送邮件通知至 {QQ_EMAIL}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
