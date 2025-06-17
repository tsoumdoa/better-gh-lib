"use client";
import { api } from "@/trpc/react";
import FilterTagDisplay from "./user-tag-display";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserTags() {
  const { data } = api.post.getUserTags.useQuery();
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  let dataArray: string[] = [];
  if (Array.isArray(data)) {
    dataArray = data;
  } else if (data) {
    dataArray = [data];
  }

  useEffect(() => {
    if (tagFilters.length === 0) {
      replace(pathname);
    }
  }, [tagFilters]);

  const updateSearchParam = (t: string, add: boolean) => {
    const searchParam = "tagFilter";
    if (add) {
      const newTagFilters = [...tagFilters, t];
      const sortBy = newTagFilters.join(",");
      params.set(searchParam, sortBy);
      replace(`${pathname}?${params.toString()}`);
    } else {
      const newTagFilters = tagFilters.filter((tf) => tf !== t);
      const sortBy = newTagFilters.join(",");
      params.set(searchParam, sortBy);
      replace(`${pathname}?${params.toString()}`);
    }
  };
  const removeSearchParam = () => {
    console.log("remove", pathname);
    setTagFilters([]);
    replace(pathname);
  };

  if (!data)
    return (
      <FilterTagDisplay
        tag="Loading..."
        tagFilters={tagFilters}
        setTagFilters={setTagFilters}
        updatePath={updateSearchParam}
      />
    );
  return (
    <div className={`flex w-full flex-wrap items-center gap-2`}>
      {dataArray.map((tag, i) => (
        <FilterTagDisplay
          key={`tag-${i}-${tag}`}
          tag={tag}
          tagFilters={tagFilters}
          setTagFilters={setTagFilters}
          updatePath={updateSearchParam}
        />
      ))}
      {tagFilters.length > 0 && (
        <Button
          onClick={() => removeSearchParam()}
          className="h-6 px-2 py-1 text-sm font-bold text-neutral-100 hover:cursor-pointer hover:bg-neutral-700 hover:text-neutral-300"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
