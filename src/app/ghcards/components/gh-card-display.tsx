"use client";
import GHCard from "@/app/components/gh-card";
import { Posts } from "@/server/db/schema";
import useFilter from "../hooks/use-filter";
import Filter from "./filter";
import { X } from "lucide-react";

export default function GHCardDisplay(props: {
  ghCards: Posts[];
  tagFilters?: string[];
}) {
  const {
    filteredCards,
    showFilter,
    handleFilter,
    filterKeyword,
    clearFilter,
  } = useFilter(props.ghCards);

  return (
    <>
      <Filter
        showFilter={showFilter}
        handleFilterAction={handleFilter}
        prevFilter={filterKeyword.current}
      />
      {filterKeyword.current.length > 0 && (
        <div className="flex flex-row items-center gap-x-1 pb-2">
          <span className="text-neutral-500">Filter keyword:</span>{" "}
          <span className="font-bold">{filterKeyword.current}</span>
          <X
            className="h-3 w-3 text-neutral-100 hover:cursor-pointer"
            onClick={() => clearFilter()}
          />
        </div>
      )}
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredCards.map((item) => (
          <GHCard
            key={item.bucketUrl}
            id={item.id!}
            cardInfo={item}
            tagFilters={props.tagFilters}
          />
        ))}
      </div>
    </>
  );
}
