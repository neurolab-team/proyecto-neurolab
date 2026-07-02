"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { getTestResumePath } from "@/libs/testProgressStorage";
import { QUICK_ACCESS_CONTENT } from "./quickAccessContent";

export type QuickAccessStatus = "in_progress" | "new" | "pending_submit";

type QuickAccessTestCardProps = {
  assignmentId: string;
  title: string;
  status: QuickAccessStatus;
  answeredCount: number;
  totalQuestions: number;
  progress: number; // 0-100
};

function ProgressRing({ progress }: { progress: number }) {
  const size = 56;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F5A623"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700">
        {progress}%
      </span>
    </div>
  );
}

function NewIcon() {
  return (
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-100">
      <Star size={24} className="text-purple-600" fill="currentColor" aria-hidden="true" />
    </div>
  );
}

function PendingSubmitIcon() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width={56} height={56} className="-rotate-90">
        <circle cx={28} cy={28} r={23} fill="none" stroke="#E5E7EB" strokeWidth={5} />
        <circle cx={28} cy={28} r={23} fill="none" stroke="#10B981" strokeWidth={5} strokeLinecap="round" strokeDasharray={2 * Math.PI * 23} strokeDashoffset={0} />
      </svg>
      <span className="absolute text-xs font-bold text-emerald-700">100%</span>
    </div>
  );
}

export default function QuickAccessTestCard({
  assignmentId,
  title,
  status,
  answeredCount,
  totalQuestions,
  progress,
}: QuickAccessTestCardProps) {
  const href = getTestResumePath(assignmentId);
  const statusLabel = QUICK_ACCESS_CONTENT.statusLabels[status];
  const ctaLabel = QUICK_ACCESS_CONTENT.ctaLabels[status];

  const subtitle =
    status === "in_progress"
      ? QUICK_ACCESS_CONTENT.subtitles.in_progress(answeredCount, totalQuestions)
      : status === "pending_submit"
        ? QUICK_ACCESS_CONTENT.subtitles.pending_submit(totalQuestions)
        : QUICK_ACCESS_CONTENT.subtitles.new(totalQuestions);

  const borderColor =
    status === "in_progress" ? "#F5A623" : status === "pending_submit" ? "#10B981" : "#7C4DFF";

  const badgeClasses =
    status === "in_progress"
      ? "bg-amber-50 text-amber-700"
      : status === "pending_submit"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-purple-50 text-purple-700";

  const buttonClasses =
    status === "in_progress"
      ? "bg-[#F5A623] text-white hover:bg-[#E09500]"
      : status === "pending_submit"
        ? "bg-emerald-500 text-white hover:bg-emerald-600"
        : "border-2 border-[#2C5FE8] text-[#2C5FE8] bg-white hover:bg-blue-50";

  const arrowBgClasses =
    status === "in_progress"
      ? "bg-white/30"
      : status === "pending_submit"
        ? "bg-white/30"
        : "bg-[#2C5FE8] text-white";

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 sm:gap-5 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100"
      style={{ borderLeftWidth: 6, borderLeftColor: borderColor }}
      aria-label={`${ctaLabel}: ${title}`}
    >
      {/* Left indicator */}
      <div className="flex-shrink-0">
        {status === "in_progress" && <ProgressRing progress={progress} />}
        {status === "new" && <NewIcon />}
        {status === "pending_submit" && <PendingSubmitIcon />}
      </div>

      {/* Center content */}
      <div className="flex-1 min-w-0">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClasses}`}
        >
          {statusLabel}
        </span>
        <h3 className="mt-1.5 text-base font-bold text-[#1E293B] truncate">
          {title}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {/* Right button */}
      <div className="flex-shrink-0 hidden sm:block">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${buttonClasses}`}
        >
          {ctaLabel}
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${arrowBgClasses}`}>
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </span>
      </div>
    </Link>
  );
}
