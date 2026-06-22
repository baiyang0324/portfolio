// ============================================================
// src/components/SectionHeading.tsx — 通用段落标题
// ============================================================
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ title, subtitle, className, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn(
      "mb-8",
      align === "center" ? "text-center" : "text-left",
      className
    )}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
