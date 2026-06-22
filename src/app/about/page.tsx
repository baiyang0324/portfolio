// ============================================================
// src/app/about/page.tsx — 关于我（个人介绍 / 工作履历 / 求职意向）
// RSC 服务端组件
// ============================================================

import Link from "next/link";
import { Download, MapPin, Mail, Phone, School, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* ========== 个人基础介绍 ========== */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <SectionHeading
          title="个人基础介绍"
          subtitle="AI 数据标注背景，自学转型全栈 AI 应用开发"
          align="left"
        />

        <div className="rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 space-y-6">
          {/* 基本信息 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <School className="w-4 h-4" />
              专科起点，东北大学继续教育，本科在读
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              沈阳市
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              2975176088@qq.com
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              18241560415
            </span>
          </div>

          <div className="border-t dark:border-gray-800" />

          {/* 个人优势 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">个人优势</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                拥有 AI 训练师经验，精通多种数据标注类型，包括 ASR 语音标注、点云 3D/4D 场景标注
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                熟练掌握 Excel，能够使用 Excel 进行数据分析与分类
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                擅长 Prompt 工程设计，熟练使用 ChatGPT 等大语言模型
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                拥有 1 年 AI 数据经验，兼具 ASR 语音与自动驾驶点云双重背景
              </li>
            </ul>
          </div>

          {/* 自学转型说明 */}
          <div className="bg-accent-50 dark:bg-accent-950 border border-accent-200 dark:border-accent-800 rounded-xl p-4">
            <p className="text-sm text-accent-700 dark:text-accent-300 leading-relaxed">
              本人过往从事 AI 数据标注相关工作，为拓宽技术能力，独立自学 Next.js、Node.js、
              大模型 API 对接等技术，并开发了本演示站点。站点完整实现了 SSE 流式对话、
              文档解析与 RAG 问答、Prompt 配置面板、Function Calling 工具调用等核心功能，
              可前往
              <Link
                href="/ai-demo"
                className="font-medium text-accent-600 dark:text-accent-400 hover:underline mx-1"
              >
                AI 演示页
              </Link>
              在线体验。
            </p>
          </div>
        </div>
      </section>

      {/* ========== 工作履历 ========== */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <SectionHeading
          title="工作履历"
          subtitle="1 年 AI 训练数据生产经验，兼具语音与自动驾驶点云双重背景"
          align="left"
        />

        <div className="rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 space-y-6">
          {/* 公司信息 */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              辽宁北向网络信息安全技术服务有限公司（国企）
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
              2025.07 — 2026.05
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
              负责 AI 训练数据生产、语音与点云数据标注、数据质量管控及客户隐私安全保障工作，
              严格按照项目规范与交付标准执行标注任务，持续为自动驾驶、语音识别、NLP 等 AI
              模型提供高精度、高合规性的训练数据，全程参与数据处理、标注质检、问题复盘与
              效率优化全流程。
            </p>
          </div>

          <div className="border-t dark:border-gray-800" />

          {/* 核心内容与实践 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">核心内容与实践</h3>
            <div className="space-y-5">
              {/* 第1项 */}
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    ASR 语音数据精细化标注
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    承担海天瑞声 ASR 语音数据精细化标注核心工作，完成语音转写、时间戳精准切分、
                    说话人分离与声道区分任务，能够准确识别并规范标注背景噪音、语气词、停顿、
                    方言、多人对话等复杂声学场景，严格遵循发音转写规则与语法规范，有效提升
                    语音识别模型在复杂环境下的鲁棒性与识别准确率。每天负责 7 小时方言/噪音
                    数据处理，通过优化标注规则，将 WER 从 15% 降低至 4%，超出客户交付标准 5%，
                    为 NLP 模型训练提供高质量、高可用语料。
                  </p>
                </div>
              </div>

              {/* 第2项 */}
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    激光雷达 3D/4D 点云数据标注（主导项目）
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    主导激光雷达 3D/4D 点云数据标注项目，熟练使用 2D/3D 联合标注工具，对城市
                    道路、高速路等场景中的车辆、行人、骑行者、护栏、障碍物等目标进行 3D 立体
                    框选、属性标注与分类。处理连续帧 4D 点云数据，精准追踪物体运动轨迹、速度
                    矢量与姿态变化，解决点云稀疏、物体遮挡、光线干扰、远距离识别等复杂场景
                    标注难题。主导 2 个城市场景的 3D/4D 标注，日均处理帧数达 150 帧，准确率
                    达到 98% 以上，成功支撑客户模型在遮挡场景下的识别率提升，直接支撑自动驾驶
                    感知算法的训练、验证与迭代优化。
                  </p>
                </div>
              </div>

              {/* 第3项 */}
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    数据自检互检与质量优化
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    开展数据自检互检与质量优化，使用 Excel 做数据整理、统计与分类，协助搭建
                    AI 数据工作流，提升团队标注效率与交付稳定性。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 求职意向 ========== */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <SectionHeading
          title="求职意向"
          subtitle="从 AI 数据层面向 AI 应用开发层面转型"
          align="left"
        />

        <div className="rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            目标岗位：
            <strong className="text-gray-900 dark:text-white">
              Claude 开发工程师 / AI 全栈工程师
            </strong>
            。拥有 AI 训练数据生产的一线经验，深刻理解数据质量对模型效果的决定性影响。
            通过自学掌握了 Next.js 14、TypeScript、Node.js、Anthropic Claude API、
            RAG 检索增强生成、Function Calling 等全栈 AI 开发能力，并独立完成本作品集站点。
            期望将 AI 数据领域的实践经验与自学获得的全栈开发能力相结合，在 Claude 相关
            产品的研发、数据工程或 DevRel 等方向长期发展。
          </p>
        </div>
      </section>

      {/* ========== 简历下载 ========== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center p-8 rounded-2xl border dark:border-gray-800 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            📄 简历下载
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            完整的 PDF 简历，包含个人优势、工作履历与项目详情
          </p>
          <a
            href="/resume.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-lg shadow-primary-500/25"
          >
            <Download className="w-4 h-4" />
            下载简历 (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}
