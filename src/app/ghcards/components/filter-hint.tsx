"use client";
import { useEffect, useState } from "react";

export function FilterHint() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(window.navigator.userAgent.includes("Mac"));
    }
  }, []);

  return (
    <div className="hidden items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-400 sm:flex">
      <span>Filter</span>
      <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-neutral-600 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-neutral-300 opacity-100 select-none">
        {isMac ? "⌘" : "Ctrl"}
      </kbd>
      <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-neutral-600 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-neutral-300 opacity-100 select-none">
        K
      </kbd>
    </div>
  );
}
