"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

export default function Filter(props: {
  handleFilterAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showFilter: boolean;
  prevFilter: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (props.showFilter) {
      ref.current?.focus();
    }
  }, [props.showFilter]);

  if (!props.showFilter) return null;
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-start justify-center bg-black/80 pt-24">
      <Input
        ref={ref}
        onChange={props.handleFilterAction}
        className="w-1/2 rounded-md border-2 border-neutral-700 bg-neutral-900 p-4 text-white ring-offset-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Filter by name, description, or tags... (esc to clear or enter to apply)"
        value={props.prevFilter}
      />
    </div>
  );
}
