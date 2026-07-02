"use client";

import { CheckCircle } from "lucide-react";
import { QUICK_ACCESS_CONTENT } from "./quickAccessContent";

export default function EmptyQuickAccessState() {
  return (
    <section className="w-full px-6 py-12 bg-[#F1F5F9]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#2C5FE8] mb-8">
          {QUICK_ACCESS_CONTENT.sectionTitle}
        </h2>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-sm border border-slate-100">
          <CheckCircle
            size={40}
            className="text-emerald-400 mb-4"
            aria-hidden="true"
          />
          <p className="text-base text-slate-600 max-w-md">
            {QUICK_ACCESS_CONTENT.emptyMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
