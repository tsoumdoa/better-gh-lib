"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SORT_ORDERS, SortOrder, SortOrderValue } from "@/types/types";

export default function SortDropDown() {
  const [position, setPosition] = useState<SortOrder>("ascCreated");
  const [sortBy, setSortBy] = useState<SortOrderValue>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-sm ring-1 ring-neutral-500 transition-all">
          <span>{sortBy || "Sort by"}</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(v) => {
            setPosition(v as SortOrder);
            const sortBy = SORT_ORDERS.find((item) => item.value === v)?.label;
            setSortBy(sortBy!);
          }}
        >
          {SORT_ORDERS.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
