import { Posts } from "@/server/db/schema";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Fuse from "fuse.js";

const fuseOptions = {
  keys: [],
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
  ignoreCase: true,
};

export default function useFilter(ghCards: Posts[]) {
  const [filteredCards, setFilteredCards] = useState(ghCards);
  const [showFilterRes, setShowFilterRes] = useState(false);
  const filterKeyword = useRef<string>("");
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const paramName = "searchFilterOn";
  const router = useRouter();

  const nameFuse = new Fuse(
    ghCards.map((card) => card.name ?? ""),
    fuseOptions
  );

  const tagFuse = new Fuse(
    ghCards.map((card) => card.tags ?? []).flat(),
    fuseOptions
  );

  const descriptionFuse = new Fuse(
    ghCards.map((card) => card.description ?? ""),
    fuseOptions
  );

  const updateSearchParam = (b: boolean) => {
    const newParams = new URLSearchParams(params);
    newParams.set(paramName, b.toString());
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  const clearFilter = () => {
    updateSearchParam(false);
    setFilteredCards(ghCards);
    filterKeyword.current = "";
    setShowFilterRes(false);
  };

  useEffect(() => {
    if (!showFilterRes) {
      setFilteredCards(ghCards);
    }
  }, [ghCards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowFilterRes((prev) => !prev);
      }
      if (e.key === "Escape") {
        clearFilter();
      }
      if (e.key === "Enter") {
        setShowFilterRes(false);
        if (filterKeyword.current === "") {
          updateSearchParam(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    filterKeyword.current = keyword;
    updateFilter(keyword);
  };

  const updateFilter = (keyword: string) => {
    if (keyword.length > 0) updateSearchParam(true);
    if (keyword === "") {
      updateSearchParam(false);
      setFilteredCards(ghCards);
      return;
    }

    const nameMatches = nameFuse.search(keyword);
    const descriptionMatches = descriptionFuse.search(keyword);
    const tagMatches = tagFuse.search(keyword);
    const matches = [...nameMatches, ...descriptionMatches, ...tagMatches];
    const set = new Set(matches.map((m) => m.item));
    setFilteredCards(ghCards.filter((card) => set.has(card.name ?? "")));
  };

  return {
    filteredCards,
    showFilter: showFilterRes,
    handleFilter,
    setShowFilter: setShowFilterRes,
    updateFilter,
    filterKeyword,
    clearFilter,
  };
}
