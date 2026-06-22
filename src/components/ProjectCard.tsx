// ============================================================
// src/components/ProjectCard.tsx — 作品项目卡片
// ============================================================
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import SkillBadge from "./SkillBadge";
import type { ProjectCard as ProjectCardType } from "@/types";

export default function ProjectCard({ project }: { project: ProjectCardType }) {
  return (
    <div className="group rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <div className="flex gap-2">
          {project.link && (
            <Link href={project.link} target="_blank"
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Features */}
      <ul className="mb-4 space-y-1">
        {project.features.map((feat) => (
          <li key={feat} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
            {feat}
          </li>
        ))}
      </ul>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <SkillBadge key={tech} label={tech} size="sm" />
        ))}
      </div>
    </div>
  );
}
