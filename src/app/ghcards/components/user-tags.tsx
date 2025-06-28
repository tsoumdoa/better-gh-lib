"use client";
import { api } from "@/trpc/react";
import FilterTagDisplay from "./user-tag-display";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./loading-spinner";

export default function UserTags() {
  const { data, refetch } = api.post.getUserTags.useQuery();
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const tagFilterIsStale = params.get("tagFilterIsStale");
    if (tagFilterIsStale === "true") {
      const newParams = new URLSearchParams(params);
      newParams.delete("tagFilterIsStale");
      startTransition(() => {
        replace(`${pathname}?${newParams.toString()}`);
        refetch();
      });
    }
  }, [tagFilters, pathname, replace, params, refetch]);

  useEffect(() => {
    if (tagFilters.length === 0) {
      replace(pathname);
    }
  }, [tagFilters, pathname, replace]);

  const updateSearchParam = (t: string, add: boolean) => {
    const searchParam = "tagFilter";
    if (add) {
      const newTagFilters = [...tagFilters, t];
      const sortBy = newTagFilters.join(",");
      params.set(searchParam, sortBy);
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    } else {
      const newTagFilters = tagFilters.filter((tf) => tf !== t);
      const sortBy = newTagFilters.join(",");
      params.set(searchParam, sortBy);
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };
  const removeSearchParam = () => {
    setTagFilters([]);
    replace(pathname);
  };

  if (!data)
    return (
      <FilterTagDisplay
        userTag={{ tag: "Loading...", count: 0 }}
        tagFilters={tagFilters}
        setTagFilters={setTagFilters}
        updatePath={updateSearchParam}
      />
    );
  return (
    <div className={`flex w-full flex-wrap items-center gap-2`}>
      {data?.map((t, i) => (
        <FilterTagDisplay
          key={`tag-${i}-${t.tag}`}
          tagFilters={tagFilters}
          userTag={t}
          setTagFilters={setTagFilters}
          updatePath={updateSearchParam}
        />
      ))}
      {!isPending && tagFilters.length > 0 && (
        <Button
          onClick={() => removeSearchParam()}
          className="h-6 px-2 py-1 text-sm font-bold text-neutral-100 hover:cursor-pointer hover:bg-neutral-700 hover:text-neutral-300"
        >
          Clear
        </Button>
      )}
      {isPending && <LoadingSpinner />}
    </div>
  );
}
