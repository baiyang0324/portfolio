// ============================================================
// src/components/SkillBadge.tsx — 技能标签
// ============================================================
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  label: string;
  variant?: "default" | "primary" | "accent";
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300",
  accent: "bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function SkillBadge({ label, variant = "default", size = "md" }: SkillBadgeProps) {
  return (
    <span className={cn(
      "inline-block rounded-full font-medium transition-colors",
      variantStyles[variant],
      sizeStyles[size]
    )}>
      {label}
    </span>
  );
}
