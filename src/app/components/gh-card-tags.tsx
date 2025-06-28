import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TagDisplay from "./gh-card-tag-display";
import { startTransition, useEffect, useMemo, useState } from "react";

export default function GhCardTags(props: {
  tags: string[];
  useNarrow: boolean;
  tagFilter?: string[];
  editMode: boolean;
  removeTag: (tag: string, bool: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const { replace } = useRouter();
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const searchParam = "tagFilter";

  const updateSearchParam = (t: string, add: boolean) => {
    const currentFilters = params.get(searchParam);
    const cfArr = currentFilters?.split(",") ?? [];
    const currentTagFilters = [...cfArr, ...tagFilters];
    const set = new Set(currentTagFilters);
    const unique = [...set];

    if (add) {
      setTagFilters([...unique, t]);
      const sortBy = unique.join(",");
      params.set(searchParam, sortBy);
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    } else {
      //handle remove
      const newTagFilters = unique.filter((tf) => tf !== t);
      setTagFilters(newTagFilters);
      const sortBy = newTagFilters.join(",");
      params.set(searchParam, sortBy);
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };
  return (
    <div
      className={`flex ${props.useNarrow ? "w-[calc(100%-4.25rem)]" : "w-full"} flex-wrap items-center gap-2 pb-2`}
    >
      {props.tags.map((tag, i) => (
        <TagDisplay
          key={`tag-${i}-${tag}-${props.editMode}`}
          tag={tag}
          removeTag={props.removeTag}
          isHighlighted={props.tagFilter?.includes(tag) ?? false}
          editMode={props.editMode}
          updatePath={updateSearchParam}
        />
      ))}
    </div>
  );
}
