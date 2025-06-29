import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useTagFilters() {
  const searchParam = "tagFilter";
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateSearchParam = (t: string, add: boolean) => {
    const currentFilters = params.get(searchParam);
    const cfArr = currentFilters?.split(",") ?? [];
    const currentTagFilters = [...cfArr, ...tagFilters];
    const set = new Set(currentTagFilters);
    const unique = [...set];

    if (add) {
      const newTagFilters = [...unique, t];
      params.set(searchParam, newTagFilters.join(","));
      setTagFilters(newTagFilters);
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    } else {
      const newTagFilters = unique.filter((tf) => tf !== t);
      if (newTagFilters.length === 0) {
        removeSearchParam();
        return;
      }
      const sortBy = newTagFilters.join(",");
      params.set(searchParam, sortBy);
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };
  const removeSearchParam = () => {
    params.delete(searchParam);
    setTagFilters([]);
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return {
    tagFilters,
    setTagFilters,
    updateSearchParam,
    removeSearchParam,
    params,
    pathname,
    replace,
    startTransition,
    isPending,
  };
}
