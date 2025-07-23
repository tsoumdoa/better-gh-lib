import { Posts } from "@/server/db/schema";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function useFilter(ghCards: Posts[]) {
  const [filteredCards, setFilteredCards] = useState(ghCards);
  const [showFilter, setShowFilter] = useState(false);
  const filterKeyword = useRef<string>("");
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const paramName = "searchFilterOn";
  const router = useRouter();

  const updateSearchParam = (b: boolean) => {
    const newParams = new URLSearchParams(params);
    newParams.set(paramName, b.toString());
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  const clearFilter = () => {
    updateSearchParam(false);
    setFilteredCards(ghCards);
    filterKeyword.current = "";
    setShowFilter(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowFilter((prev) => !prev);
      }
      if (e.key === "Escape") {
        clearFilter();
      }
      if (e.key === "Enter") {
        setShowFilter(false);
        if (filterKeyword.current === "") {
          updateSearchParam(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ghCards]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    filterKeyword.current = keyword;
    updateFilter(keyword);
  };

  const updateFilter = (keyword: string) => {
    if (keyword.length > 0) updateSearchParam(true);
    if (keyword === "") updateSearchParam(false);

    const filtered = ghCards.filter((card) => {
      const tags = card.tags ?? [];
      return (
        card.name?.toLowerCase().includes(keyword) ||
        card.description?.toLowerCase().includes(keyword) ||
        tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    });
    setFilteredCards(filtered);
  };

  return {
    filteredCards,
    showFilter,
    handleFilter,
    setShowFilter,
    updateFilter,
    filterKeyword,
    clearFilter,
  };
}
