import { Posts } from "@/server/db/schema";
import { useEffect, useState, useRef } from "react";

export default function useFilter(ghCards: Posts[]) {
  const [filteredCards, setFilteredCards] = useState(ghCards);
  const [showFilter, setShowFilter] = useState(false);
  const filterKeyword = useRef<string>("");

  useEffect(() => {
    if (ghCards) updateFilter(filterKeyword.current);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowFilter((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowFilter(false);
        setFilteredCards(ghCards);
        filterKeyword.current = "";
      }
      if (e.key === "Enter") {
        setShowFilter(false);
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
    filterKeyword,
  };
}
