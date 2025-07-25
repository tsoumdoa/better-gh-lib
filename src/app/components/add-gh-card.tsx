"use client";

import { useMemo, useState } from "react";
import { AddGhDialog } from "./add-gh-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AddGHCard() {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const handleAddClick = () => {
    setOpen(!open);
    params.set("tagFilterIsStale", "true");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <AddGhDialog
        open={open}
        setOpen={(b) => setOpen(b)}
        setAdding={(b) => setAdding(b)}
        adding={adding}
      />
      <button
        className="h-8 rounded-md bg-black px-3 py-1 text-sm font-bold ring-2 ring-neutral-300 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
        onClick={handleAddClick}
      >
        {adding ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
